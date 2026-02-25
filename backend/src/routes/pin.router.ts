import express from "express";
import { pinRepository, unpinRepository, getPinnedRepositories } from "../controllers/pinController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const pinRouter = express.Router();

pinRouter.put("/pin/:repoId", authMiddleware, pinRepository);
pinRouter.put("/unpin/:repoId", authMiddleware, unpinRepository);
pinRouter.get("/pinned/:userId", getPinnedRepositories);
