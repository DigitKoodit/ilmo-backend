import type { RequestHandler } from "express";
import { responseMessage } from "../../helpers/errorResponse";
import { database } from "../../services/database";

/**
 * DELETE `/api/event/:slug`
 *
 * Removes one or more users from an event.
 */
export const eventDeleteHandler: RequestHandler<{ slug: string }> = async (
  req,
  res
) => {
  const { slug } = req.params;
  const users = req.body; // users to delete

  let enrollData = await database.getEnrollData(slug);

  if (!enrollData) {
    return responseMessage(res, 404, "event not found");
  }

  // TODO: delete users
  return responseMessage(res, 501, "not implemented");
};
