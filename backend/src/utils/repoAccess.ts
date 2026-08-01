import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

/**
 * Resolve the userId from an optional Authorization header.
 * Returns null when there is no token, no JWT_SECRET, or the token is invalid.
 */
export function getOptionalUserId(req: Request): string | null {
  const header = req.headers["authorization"];
  if (!header) return null;

  const token = header.startsWith("Bearer ") ? header.substring(7) : header;
  if (!process.env.JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id?: string };
    return decoded.id || null;
  } catch {
    return null;
  }
}

/**
 * A repository can be viewed when it is public, or when the requester is the
 * owner or an explicit collaborator (RepoAccess row). Private repos are
 * visible to nobody else.
 */
export async function canViewRepo(
  repo: { id: string; ownerId: string; visibility: boolean },
  userId: string | null,
): Promise<boolean> {
  if (repo.visibility === true) return true;
  if (userId === null) return false;
  if (userId === repo.ownerId) return true;

  const access = await prisma.repoAccess.findUnique({
    where: { userId_repositoryId: { userId, repositoryId: repo.id } },
  });
  return access !== null;
}

/**
 * Fetch a repo and enforce visibility for an optional (unauthenticated-safe)
 * request. Writes a 404 (hides the repo's existence for private repos) and
 * returns false when the caller may not access it.
 */
export async function canAccessRepo(
  req: Request,
  res: Response,
  repoId: string,
): Promise<boolean> {
  const repo = await prisma.repository.findUnique({
    where: { id: repoId },
    select: { id: true, ownerId: true, visibility: true },
  });

  if (!repo || !(await canViewRepo(repo, getOptionalUserId(req)))) {
    res.status(404).json({ msg: "Repository not found" });
    return false;
  }
  return true;
}
