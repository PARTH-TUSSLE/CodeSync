import express from "express";
import type { Request, Response } from "express";
import { userRouter } from "./user.router.js";
import { repoRouter } from "./repo.router.js";
import { issueRouter } from "./issue.router.js";

export const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server ! ");
});
