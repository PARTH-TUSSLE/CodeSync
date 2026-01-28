import express from "express";
import type { Request, Response } from "express";
import { userRouter } from "./user.router.js";

export const mainRouter = express.Router();

mainRouter.use(userRouter);

mainRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server ! ");
});
