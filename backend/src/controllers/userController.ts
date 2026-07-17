import type { Request, Response } from "express";
import {
  SignupSchema,
  SignInSchema,
  updationSchema,
  changePasswordSchema,
} from "../types.js";
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

  if (!req.userId || req.userId !== userID) {
    return res.status(403).json({
      msg: "You can only update your own profile",
    });
  }

  if (!parsedData.success) {
    return res.status(400).json({
      msg: "Invalid inputs",
    });
  }

  try {
    const { username, bio, profilePic } = parsedData.data;

    const updateData: {
      username?: string;
      bio?: string[];
      profilePic?: string | null;
    } = {};

    if (username !== undefined) {
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        return res.status(400).json({ msg: "Username cannot be empty" });
      }
      updateData.username = trimmedUsername;
    }

    if (bio !== undefined) {
      updateData.bio = [bio.trim()];
    }

    if (profilePic !== undefined) {
      const trimmedPic = profilePic.trim();
      updateData.profilePic = trimmedPic || null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        msg: "At least one field is required: username, bio, or profilePic",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userID),
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        bio: true,
        profilePic: true,
      },
    });

    return res.status(200).json({
      msg: "Profile updated successfully !",
      updatedUser,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unique")
    ) {
      return res.status(409).json({
        msg: "Username is already taken",
      });
    }

    return res.status(500).json({
      msg: `Some error occurred while updating! - ${message}`,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const parsedData = changePasswordSchema.safeParse(req.body);
  const userID = req.params.id;

  if (!req.userId || req.userId !== userID) {
    return res.status(403).json({
      msg: "You can only change your own password",
    });
  }

  if (!parsedData.success) {
    return res.status(400).json({
      msg: "Invalid password inputs",
    });
  }

  try {
    const { oldPassword, newPassword, confirmNewPassword } = parsedData.data;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        msg: "New password and confirm password do not match",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: String(userID) },
      select: { password: true },
    });

    if (!existingUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password,
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        msg: "Old password is incorrect",
      });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, existingUser.password);
    if (isSameAsOld) {
      return res.status(400).json({
        msg: "New password must be different from old password",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: String(userID) },
      data: { password: newHashedPassword },
    });

    return res.status(200).json({
      msg: "Password updated successfully !",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Some error occurred while updating password! - ${message}`,
    });
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  const userID = req.params.id;
  const userId = req.userId;

  if (!userId || userId !== userID) {
    return res.status(403).json({
      msg: "You can only delete your own profile",
    });
  }

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


export const followUser = async (req: Request, res: Response) => {
  const followUserId = String(req.params.userId);
  const currentUserId = req.userId;

  if (!currentUserId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (currentUserId === followUserId) {
    return res.status(400).json({ msg: "Cannot follow yourself" });
  }

  try {
    const userToFollow = await prisma.user.findUnique({
      where: { id: followUserId },
    });

    if (!userToFollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: { connect: { id: followUserId } },
      },
    });

    return res.status(200).json({ msg: "User followed successfully" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error following user", error: errMsg });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  const followUserId = String(req.params.userId);
  const currentUserId = req.userId;

  if (!currentUserId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: { disconnect: { id: followUserId } },
      },
    });

    return res.status(200).json({ msg: "User unfollowed successfully" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error unfollowing user", error: errMsg });
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
