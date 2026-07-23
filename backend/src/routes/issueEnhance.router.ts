import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createLabel,
  getLabels,
  deleteLabel,
  addIssueLabel,
  removeIssueLabel,
  assignIssue,
  createMilestone,
  getMilestones,
  deleteMilestone,
  createIssueComment,
  getIssueComments,
} from "../controllers/issueEnhanceController.js";

export const issueEnhanceRouter = express.Router();

issueEnhanceRouter.post("/repo/:repoId/labels", authMiddleware, createLabel);
issueEnhanceRouter.get("/repo/:repoId/labels", getLabels);
issueEnhanceRouter.delete("/repo/:repoId/labels/:labelId", authMiddleware, deleteLabel);

issueEnhanceRouter.post("/repo/:repoId/issues/:issueId/labels", authMiddleware, addIssueLabel);
issueEnhanceRouter.delete("/repo/:repoId/issues/:issueId/labels", authMiddleware, removeIssueLabel);

issueEnhanceRouter.patch("/repo/:repoId/issues/:issueId/assign", authMiddleware, assignIssue);

issueEnhanceRouter.post("/repo/:repoId/milestones", authMiddleware, createMilestone);
issueEnhanceRouter.get("/repo/:repoId/milestones", getMilestones);
issueEnhanceRouter.delete("/repo/:repoId/milestones/:milestoneId", authMiddleware, deleteMilestone);

issueEnhanceRouter.post("/repo/:repoId/issues/:issueId/comments", authMiddleware, createIssueComment);
issueEnhanceRouter.get("/repo/:repoId/issues/:issueId/comments", getIssueComments);
