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
  const token = req.headers["authorization"];

  try {
    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized! No token provided.",
      });
    }

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
