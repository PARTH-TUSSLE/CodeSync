import express from "express";
import {
  deleteUserProfile,
  getAllUsers,
  getUserProfile,
  getUserContributions,
  login,
  signup,
  updateUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const userRouter = express.Router();

userRouter.get("/allUsers", getAllUsers);
userRouter.post("/signup", signup);
userRouter.get("/userProfile", (req, res) => {
  return res.status(400).json({
    msg: "User ID required !",
  });
});
userRouter.get("/userProfile/:id",authMiddleware, getUserProfile);
userRouter.post("/login", login);
userRouter.put("/updateProfile/:id",authMiddleware, updateUserProfile);
userRouter.delete("/deleteProfile/:id",authMiddleware, deleteUserProfile);
userRouter.get("/contributions/:id", authMiddleware, getUserContributions);
