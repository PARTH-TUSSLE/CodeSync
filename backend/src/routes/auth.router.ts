import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createDeviceSession,
  confirmDeviceSession,
  getDeviceStatus,
} from "../controllers/deviceController.js";

export const authRouter = express.Router();

authRouter.post("/auth/device", createDeviceSession);
authRouter.post("/auth/device/confirm", authMiddleware, confirmDeviceSession);
authRouter.get("/auth/device/status", getDeviceStatus);
