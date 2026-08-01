import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../prisma.js";

const DEVICE_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CLI_TOKEN_EXPIRY = "365d";

function randomCode(length: number): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

/**
 * POST /auth/device
 * Creates a pending device session for the CLI to poll.
 */
export const createDeviceSession = async (req: Request, res: Response) => {
  try {
    const deviceCode = randomCode(20);
    const userCode = randomCode(6).toUpperCase();
    const expiresAt = new Date(Date.now() + DEVICE_CODE_TTL_MS);

    await prisma.deviceSession.create({
      data: { deviceCode, userCode, expiresAt, status: "pending" },
    });

    return res.status(201).json({
      deviceCode,
      userCode,
      expiresIn: DEVICE_CODE_TTL_MS,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error creating device session: ${msg}`);
    return res.status(500).json({ msg: "Failed to create device session" });
  }
};

/**
 * POST /auth/device/confirm (authMiddleware)
 * The logged-in web user confirms a pairing code. Issues a long-lived CLI
 * token bound to that user so the CLI only ever has to log in once.
 */
export const confirmDeviceSession = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const userCode = String(req.body?.userCode ?? "")
    .trim()
    .toUpperCase();
  if (!userCode) {
    return res.status(400).json({ msg: "userCode is required" });
  }

  try {
    const session = await prisma.deviceSession.findFirst({
      where: { userCode, status: "pending", expiresAt: { gt: new Date() } },
    });

    if (!session) {
      return res.status(404).json({ msg: "Invalid or expired code" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ msg: "JWT_SECRET not configured" });
    }

    const token = jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: CLI_TOKEN_EXPIRY,
    });

    await prisma.deviceSession.update({
      where: { id: session.id },
      data: { userId, token, status: "authorized" },
    });

    return res.json({ msg: "Device authorized successfully" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error confirming device session: ${msg}`);
    return res.status(500).json({ msg: "Failed to authorize device" });
  }
};

/**
 * GET /auth/device/status?deviceCode=...
 * Polled by the CLI. Returns the long-lived token exactly once when the
 * session moves to "authorized".
 */
export const getDeviceStatus = async (req: Request, res: Response) => {
  const deviceCode = String(req.query.deviceCode ?? "").trim();
  if (!deviceCode) {
    return res.status(400).json({ msg: "deviceCode is required" });
  }

  try {
    const session = await prisma.deviceSession.findUnique({
      where: { deviceCode },
    });

    if (!session) {
      return res.status(404).json({ msg: "Device session not found" });
    }

    if (session.expiresAt < new Date()) {
      await prisma.deviceSession.update({
        where: { id: session.id },
        data: { status: "expired" },
      });
      return res.json({ status: "expired" });
    }

    if (session.status === "authorized" && session.token) {
      await prisma.deviceSession.update({
        where: { id: session.id },
        data: { status: "completed" },
      });
      return res.json({
        status: "authorized",
        token: session.token,
        userId: session.userId,
      });
    }

    return res.json({ status: session.status });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`Error checking device status: ${msg}`);
    return res.status(500).json({ msg: "Failed to check device status" });
  }
};
