import type { RequestHandler } from "express";
import { responseMessage } from "../../helpers/errorResponse";
import { getEventContentCached } from "../../services/contentful";
import { database } from "../../services/database";

/**
 * GET `/api/event/:slug`
 *
 * Returns the enroll data for an event.
 * If the data does not yet exist, a new enroll data entry is created in the database.
 */
export const eventGetHandler: RequestHandler<{ slug: string }> = async (
  req,
  res
) => {
  const { slug } = req.params;

  let enrollData = await database.getEnrollData(slug);

  if (!enrollData) {
    // make sure that event exists in CMS before creating database entry
    const eventInfo = await getEventContentCached(slug);

    if (!eventInfo) {
      return responseMessage(res, 404, "event not found");
    }

    // create new entry in database
    enrollData = await database.createEnrollData(slug);
  }

  return res.status(200).json(enrollData);
};
