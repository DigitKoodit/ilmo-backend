import { Router } from "express";
import { eventRouter } from "./event";

export const apiRouter = Router();

/**
 * /api
 */
apiRouter.get("/", (_, res) => res.status(200).send("ok"));

/**
 * /api/event
 */
apiRouter.use("/event", eventRouter);
