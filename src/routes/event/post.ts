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
    return responseMessage(res, 400, "MALFORMED_BODY");
  }

  const currentTime = Date.now();

  // make sure that event exists in CMS
  const eventInfo = await getEventContentCached(slug);

  if (!eventInfo) {
    return responseMessage(res, 404, "NOT_FOUND");
  }

  const { enrollStart, enrollEnd, enrollmentEnabled, enrollForm } =
    eventInfo.fields;

  if (!enrollmentEnabled) {
    return responseMessage(res, 400, "ENROLL_DISABLED");
  }
  if (currentTime < new Date(enrollStart).getTime()) {
    return responseMessage(res, 400, "ENROLL_NOT_STARTED");
  }
  if (currentTime > new Date(enrollEnd).getTime()) {
    return responseMessage(res, 400, "ENROLL_ENDED");
  }

  // clean up user before saving it to database
  const user = validateAndCleanUser(enrollForm, unvalidatedUser);
  if (!user) {
    return responseMessage(res, 400, "MALFORMED_BODY");
  }

  let enrollData = await database.getEnrollData(slug);
  if (!enrollData) {
    // create new entry in database
    enrollData = await database.createEnrollData(slug);
  }

  // make sure that user isn't already enrolled
  if (database.userEnrollStatus(enrollData, user.email) !== "none") {
    return responseMessage(res, 400, "ALREADY_ENROLLED");
  }

  // update user enroll date to server time
  unvalidatedUser.dateEnrolled = new Date(currentTime);

  const enrollStatus = await database.enrollUser(enrollData, user);

  return res.status(200).json({
    slug,
    user,
    enrollStatus,
  });
};
