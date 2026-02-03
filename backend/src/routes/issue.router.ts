import express from "express";
import { createIssue, deleteIssueByID, getAllIssues, getIssueByID, updateIssueByID } from "../controllers/issueController.js";

export const issueRouter = express.Router();

issueRouter.post("/issue/create", createIssue);
issueRouter.put("/issue/update/:id", updateIssueByID);
issueRouter.delete("/issue/delete/:id", deleteIssueByID);
issueRouter.get("/allIssues/:id", getAllIssues);
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