import { RequestHandler } from "express";
import { getEventContentCached } from "../../services/contentful";
import { database } from "../../services/database";

/**
 * POST `/api/event/:slug`.
 *
 * Handles enrollment submissions.
 */
export const eventPostHandler: RequestHandler<{ slug: string }> = async (
  req,
  res
) => {
  const { slug } = req.params;

  let enrollData = await database.getEnrollData(slug);

  if (!enrollData) {
    // make sure that event exists in CMS before creating database entry
    const eventInfo = await getEventContentCached(slug);

    if (!eventInfo) {
      return res.status(404).json({ status: 404, message: "event not found" });
    }

    // create new entry in database
    enrollData = await database.createEnrollData(slug);
  }

  // TODO: check that enrollment period is active
  // TODO: put person in reserves if

  return res.status(200).json({ slug });
};
