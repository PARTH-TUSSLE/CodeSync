import express from "express";
import { createRepository, deleteRepositoryByID, fetchRepositoriesForCurrentUser, fetchRepositoryByID, fetchRepositoryByName, getAllRepositories, toggleVisibilityByID, updateRepositoryByID } from "../controllers/repoController.js";

export const repoRouter = express.Router();

repoRouter.post("/repo/create", createRepository);
repoRouter.get("/repo/all", getAllRepositories);
repoRouter.get("/repo/:id", fetchRepositoryByID);
repoRouter.get("/repo/:name", fetchRepositoryByName);
repoRouter.post("/repo/:userID",fetchRepositoriesForCurrentUser );
repoRouter.put("/repo/update/:id", updateRepositoryByID);
repoRouter.delete("/repo/delete/:id", deleteRepositoryByID);
repoRouter.patch("/repo/toggle/:id", toggleVisibilityByID );
