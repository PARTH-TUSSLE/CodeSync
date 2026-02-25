import type { Request, Response } from "express";
import { SignupSchema, SignInSchema, updationSchema } from "../types.js";
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
      message:
        "Some error occurred while signing up. Possible error could be, username or email already taken",
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
        id: String(userID),
      },
      select: {
        id: true,
        username: true,
        email: true,
        followers: true,
        following: true,
        starredRepos: {
          select: { id: true },
        },
        pinnedRepos: {
          select: { id: true },
        },
        bio: true,
        profilePic: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        msg: "Invalid userID",
      });
    }

    // Transform starredRepos to array of IDs
    const formattedProfile = {
      ...userProfile,
      starredRepos: userProfile.starredRepos.map((repo) => repo.id),
      pinnedRepos: userProfile.pinnedRepos.map((repo) => repo.id),
    };

    return res.status(200).json({
      msg: "Profile fetch successful !",
      user: formattedProfile,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error while fetching profile",
      error: errMsg,
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const parsedData = updationSchema.safeParse(req.body);
  const userID = req.params.id;

  if (!parsedData.success) {
    return res.status(400).json({
      msg: "Invalid inputs",
    });
  }

  try {
    const newEmail = parsedData.data.email;
    const newPassword = parsedData.data.password;

    if (newEmail && newPassword) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: {
          id: String(userID),
        },
        data: {
          email: newEmail,
          password: newHashedPassword,
        },
      });

      return res.status(200).json({
        msg: "Email and password updated successfully !",
        updatedUser,
      });
    }

    if (newEmail) {
      const updatedUser = await prisma.user.update({
        where: {
          id: String(userID),
        },
        data: {
          email: newEmail,
        },
      });

      return res.status(200).json({
        msg: "Email updated successfully !",
        updatedUser,
      });
    }

    if (newPassword) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await prisma.user.update({
        where: {
          id: String(userID),
        },
        data: {
          password: newHashedPassword,
        },
      });

      return res.status(200).json({
        msg: "Password updated successfully !",
        updatedUser,
      });
    }

    return res.status(400).json({
      msg: "At least one field is required, email or password",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    res.status(500).json({
      msg: `Some error occurred while updating! - ${message}`,
    });
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  const userID = req.params.id;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: String(userID),
      },
    });

    if (deletedUser) {
      return res.status(200).json({
        msg: "User deleted successfully !",
        deletedUser,
      });
    } else {
      return res.status(400).json({
        msg: "User not found !",
      });
    }
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);

    if (
      error instanceof Error &&
      error.message.includes("No record was found for a delete.")
    ) {
      return res.status(404).json({
        msg: "User not found!",
      });
    }

    return res.status(500).json({
      msg: `Error while deleting the user - ${errMessage}`,
    });
  }
};


export const getUserContributions = async (req: Request, res: Response) => {
  const userId = String(req.params.id);
  const { year } = req.query;

  try {
    const currentYear = year
      ? parseInt(year as string)
      : new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    // Fetch all activities for this user in the specified year
    const activities = await prisma.activity.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate, // greater than or equal
          lte: endDate, // less than or equal
        },
      },
      select: {
        createdAt: true,
        type: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const contributionMap = new Map<string, number>();

    activities.forEach((activity) => {
      const date = activity.createdAt.toISOString().split("T")[0];
      contributionMap.set(String(date), (contributionMap.get(String(date)) || 0) + 1);
    });

    const contributions = Array.from(contributionMap.entries()).map(
      ([date, count]) => ({
        date,
        count,
      }),
    );

    return res.status(200).json({
      msg: "Contributions fetched successfully",
      contributions,
      totalContributions: activities.length,
      year: currentYear,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error fetching contributions",
      error: errMsg,
    });
  }
};
