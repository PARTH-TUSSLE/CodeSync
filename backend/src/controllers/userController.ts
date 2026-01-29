import type { Request, Response } from "express";
import { SignupSchema, SignInSchema } from "../types.js";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req: Request, res: Response) => {};

export const signup = async (req: Request, res: Response) => {
  const parsedUserInfo = SignupSchema.safeParse(req.body);

  try {
    if (!parsedUserInfo.success) {
      return res.status(400).json({
        msg: "Invalid inputs",
      });
    } else {
      const username = parsedUserInfo.data.username;
      const password = parsedUserInfo.data.password;
      const email = parsedUserInfo.data.email;

      const hashedPass = await bcrypt.hash(password, 10);

      const createdUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPass,
        },
      });

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT secret not configured");
      }

      const token = jwt.sign({ id: createdUser.id }, jwtSecret, {
        expiresIn: "7d",
      });

      const { password: _pw, ...userWithoutPassword } = createdUser;

      return res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword,
        token,
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      message: "Some error occurred while signing up",
      error: msg,
    });
  }
};

export const login = (req: Request, res: Response) => {
  res.send("logging in!");
};

export const getUserProfile = (req: Request, res: Response) => {
  res.send("Profile fetched!");
};

export const updateUserProfile = (req: Request, res: Response) => {
  res.send("Profile update");
};

export const deleteUserProfile = (req: Request, res: Response) => {
  res.send("Profile deleted");
};
