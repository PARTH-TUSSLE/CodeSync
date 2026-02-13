import express from "express";
import type { Request, Response } from "express";
import { userRouter } from "./user.router.js";
import { repoRouter } from "./repo.router.js";
import { issueRouter } from "./issue.router.js";
import { starRouter } from "./star.router.js";

export const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use(starRouter);

mainRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server ! ");
});
