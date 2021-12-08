import { RequestHandler } from "express";
import { isUser } from "../../models/user";
import { getEventContentCached } from "../../services/contentful";
import { database } from "../../services/database";
import { responseMessage } from "../../helpers/errorResponse";
import { validateAndCleanUser } from "../../helpers/enroll";

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
  let unvalidatedUser = req.body;

  // make sure that request body is in correct format.
  // NOTE: extra fields are not yet validated.
  if (!isUser(unvalidatedUser)) {
    return responseMessage(res, 400, "malformed request body");
  }

  const currentTime = Date.now();

  // make sure that event exists in CMS
  const eventInfo = await getEventContentCached(slug);

  if (!eventInfo) {
    return responseMessage(res, 404, "event not found");
  }

  // get enrollment settings from CMS event info
  const { enrollStart, enrollEnd, enrollmentEnabled, enrollForm } =
    eventInfo.fields;

  if (!enrollmentEnabled) {
    return responseMessage(res, 400, "enroll is disabled");
  }
  if (currentTime < new Date(enrollStart).getTime()) {
    return responseMessage(res, 400, "enroll period has not started");
  }
  if (currentTime > new Date(enrollEnd).getTime()) {
    return responseMessage(res, 400, "enroll period has ended");
  }

  // clean up user before saving it to database
  const user = validateAndCleanUser(enrollForm, unvalidatedUser);
  if (!user) {
    return responseMessage(res, 400, "malformed request body");
  }

  let enrollData = await database.getEnrollData(slug);
  if (!enrollData) {
    // create new entry in database
    enrollData = await database.createEnrollData(slug);
  }

  // make sure that user isn't already enrolled
  if (database.userEnrollStatus(enrollData, user.email) !== "none") {
    return responseMessage(res, 400, "already enrolled with this email");
  }

  // update user enroll date to match server time
  unvalidatedUser.dateEnrolled = new Date(currentTime);

  // attempt to enroll the user
  const enrollStatus = await database.enrollUser(enrollData, user);

  return res.status(200).json({
    slug,
    user,
    enrollStatus,
  });
};
