import type { Request, Response } from "express";

export const getAllUsers = (req: Request, res: Response) => {
  res.send("All users fetched!");
};

export const signup = (req: Request, res: Response) => {
  res.send("signing up!");
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
