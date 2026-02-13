import express from "express";
import {
  starRepository,
  unstarRepository,
  getStarredRepositories,
} from "../controllers/starController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const starRouter = express.Router();

starRouter.put("/star/:repoId", authMiddleware, starRepository);
starRouter.put("/unstar/:repoId", authMiddleware, unstarRepository);
starRouter.get("/starred/:userId", authMiddleware, getStarredRepositories);
