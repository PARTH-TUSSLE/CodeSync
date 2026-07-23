import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPullRequest,
  getPullRequests,
  getPullRequestById,
  updatePullRequest,
  mergePullRequest,
  createPRComment,
  createPRReview,
} from "../controllers/prController.js";

export const prRouter = express.Router();

prRouter.post("/repo/:repoId/pulls", authMiddleware, createPullRequest);
prRouter.get("/repo/:repoId/pulls", getPullRequests);
prRouter.get("/repo/:repoId/pulls/:prId", getPullRequestById);
prRouter.put("/repo/:repoId/pulls/:prId", authMiddleware, updatePullRequest);
prRouter.patch("/repo/:repoId/pulls/:prId/merge", authMiddleware, mergePullRequest);

prRouter.post("/repo/:repoId/pulls/:prId/comments", authMiddleware, createPRComment);
prRouter.post("/repo/:repoId/pulls/:prId/reviews", authMiddleware, createPRReview);
