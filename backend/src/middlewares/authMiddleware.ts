import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  try {
    if (!authHeader) {
      return res.status(401).json({
        msg: "Unauthorized! No token provided.",
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        msg: "JWT_SECRET not configured!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      req.userId = (decoded as JwtPayload).id;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Unauthorized! Invalid token.",
    });
  }
};
