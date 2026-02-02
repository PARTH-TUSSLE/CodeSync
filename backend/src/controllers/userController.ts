import type { Request, Response } from "express";
import { SignupSchema, SignInSchema } from "../types.js";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});

    return res.status(200).json({
      msg: "Fetch successfull",
      users,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error while fetching users ${error.message}`);
    } else {
      console.log(`Error while fetching users ${String(error)}`);
    }
  }
};

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

export const login = async (req: Request, res: Response) => {
  const parsedData = SignInSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  try {
    const username = parsedData.data.username?.trim() || undefined;
    const email = parsedData.data.email?.trim() || undefined;
    const password = parsedData.data.password;

    if (!username && !email) {
      return res.status(400).json({
        msg: "Username or email is required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (!user) {
      return res.status(404).json({
        msg: "Invalid credentials !",
      });
    }

    const passCorrect = await bcrypt.compare(password, user.password);
    if (!passCorrect) {
      return res.status(401).json({
        msg: "Invalid credentials !",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "7d",
    });

    const { password: _pw, ...userWithoutPassword } = user;

    return res.status(200).json({
      msg: "login successful!",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userID = req.params.id;

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        msg: "Invalid userID"
      });
    }

    const { password: _pw, ...userWithoutPassword } = userProfile;

    return res.status(200).json({
      msg: "Profile fetch successful !",
      user: userWithoutPassword
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error while fetching profile",
      error: msg
    });
  }
};

export const updateUserProfile = (req: Request, res: Response) => {
  res.send("Profile update");
};

export const deleteUserProfile = (req: Request, res: Response) => {
  res.send("Profile deleted");
};
