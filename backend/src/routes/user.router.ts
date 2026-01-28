import express from "express";
import {
  deleteUserProfile,
  getAllUsers,
  getUserProfile,
  login,
  signup,
  updateUserProfile,
} from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.get("/allUsers", getAllUsers);
userRouter.post("/signup", signup);
userRouter.get("/userProfile", getUserProfile);
userRouter.post("/login", login);
userRouter.put("/updateProfile", updateUserProfile);
userRouter.delete("/deleteProfile", deleteUserProfile);
