import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createCommit,
  getCommits,
  getCommitDetail,
  getFileTree,
  getFileContent,
  getRawFile,
  getCommitDiff,
} from "../controllers/codeController.js";
import {
  getBranches,
  createBranch,
  setDefaultBranch,
  deleteBranch,
} from "../controllers/branchController.js";

export const codeRouter = express.Router();

codeRouter.post("/repo/:repoId/commits", authMiddleware, createCommit);
codeRouter.get("/repo/:repoId/commits", getCommits);
codeRouter.get("/repo/:repoId/commits/:commitId", getCommitDetail);
codeRouter.get("/repo/:repoId/commits/:commitId/diff", getCommitDiff);

codeRouter.get("/repo/:repoId/tree", getFileTree);
codeRouter.get("/repo/:repoId/blob", getFileContent);
codeRouter.get("/repo/:repoId/raw", getRawFile);

codeRouter.get("/repo/:repoId/branches", getBranches);
codeRouter.post("/repo/:repoId/branches", authMiddleware, createBranch);
codeRouter.put("/repo/:repoId/branches/:branchName/default", authMiddleware, setDefaultBranch);
codeRouter.delete("/repo/:repoId/branches/:branchName", authMiddleware, deleteBranch);
