import express from "express";
import { createRepository, deleteRepositoryByID, fetchRepositoriesForCurrentUser, fetchRepositoryByID, fetchRepositoryByName, getAllRepositories, toggleVisibilityByID, updateRepositoryByID } from "../controllers/repoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const repoRouter = express.Router();

repoRouter.post("/repo/create",authMiddleware, createRepository);
repoRouter.get("/allRepos", getAllRepositories);
repoRouter.get("/repo/:id", fetchRepositoryByID);
repoRouter.get("/repo", (req, res) => {
  return res.status(400).json({
    msg: "Repo ID or name required !",
  });
});
repoRouter.get("/repo/name/:name", fetchRepositoryByName);
repoRouter.get("/repo/user/:userID",authMiddleware,fetchRepositoriesForCurrentUser );
repoRouter.put("/repo/update/:id",authMiddleware, updateRepositoryByID);
repoRouter.patch("/repo/:id",authMiddleware, updateRepositoryByID);
repoRouter.delete("/repo/delete/:id",authMiddleware, deleteRepositoryByID);
repoRouter.patch("/repo/toggle/:id",authMiddleware, toggleVisibilityByID );
