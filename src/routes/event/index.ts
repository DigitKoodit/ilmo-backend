import { Router } from "express";
import { eventGetHandler } from "./get";
import { eventPostHandler } from "./post";
import { eventDeleteHandler } from "./delete";

/**
 * Route: `/api/event`
 */
const eventRouter = Router();

eventRouter.get("/:slug", eventGetHandler);
eventRouter.post("/:slug", eventPostHandler);
eventRouter.delete("/:slug", eventDeleteHandler);

export { eventRouter };
