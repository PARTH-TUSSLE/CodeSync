import express from "express";
import {
  createIssue,
  deleteIssueByID,
  getAllIssuesOfARepo,
  getIssueByID,
  updateIssueByID,
} from "../controllers/issueController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const issueRouter = express.Router();

issueRouter.post("/issue/create",authMiddleware, createIssue);
issueRouter.put("/issue/update/:id",authMiddleware, updateIssueByID);
issueRouter.delete("/issue/delete/:id",authMiddleware, deleteIssueByID);
issueRouter.get("/allIssues/:id", getAllIssuesOfARepo);
issueRouter.get("/allIssues", (req, res) => {
  return res.status(400).json({
    msg: "repoID is required !",
  });
});
issueRouter.get("/issue/:id", getIssueByID);
issueRouter.get("/issue", (req, res) => {
  return res.status(400).json({
    msg: "issueID is required !",
  });
});