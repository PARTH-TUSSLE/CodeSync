import express from "express";
import { createIssue, deleteIssueByID, getAllIssues, getIssueByID, updateIssueByID } from "../controllers/issueController.js";

export const issueRouter = express.Router();

issueRouter.post("/issue/create", createIssue);
issueRouter.put("/issue/update/:id", updateIssueByID);
issueRouter.delete("/issue/delete/:id", deleteIssueByID);
issueRouter.get("/issue/all", getAllIssues);
issueRouter.get("/issue/:id", getIssueByID);