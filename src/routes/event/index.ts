import { Router } from "express";
import { eventGetHandler } from "./get";
import { eventPostHandler } from "./post";

/**
 * Route: `/api/event
 */
const eventRouter = Router();

eventRouter.get("/:slug", eventGetHandler);
eventRouter.post("/:slug", eventPostHandler);

export { eventRouter };
