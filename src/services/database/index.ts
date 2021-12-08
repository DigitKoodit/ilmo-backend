import mongoose from "mongoose";
import { config } from "dotenv";
import EnrollDataModel, { EnrollData } from "../../models/event";
import { getEventContentCached } from "../../services/contentful";
import { User } from "../../models/user";

config();

/**
 * Connects to the mongodb instance
 */
const init = async () => {
  await mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("connected to database"))
    .catch(() => console.error("failed to connect to database"));
};

/**
 * Inserts a new empty event into the database
 */
const createEnrollData = async (slug: string): Promise<EnrollData> => {
  return await EnrollDataModel.create({ slug, accepted: [], reserve: [] });
};

/**
 * Fetches an event by slug from the database.
 */
const getEnrollData = async (slug: string): Promise<EnrollData> => {
  return await EnrollDataModel.findOne({ slug }).exec();
};

/**
 * Checks if an user can be enrolled to an event.
 *
 *  - `yes`: Event has room in main spots.
 *  - `reserve`: Event has no room in main spots, but reserve spots still have room
 *  - `no`: Event has no main spots or reserve spots left
 */
const canEnroll = async (
  event: EnrollData
): Promise<"yes" | "reserve" | "no"> => {
  // fetch cached event info from Contentful
  const eventContent = await getEventContentCached(event.slug);
  if (!eventContent) {
    throw new Error("event not found");
  }

  const { spots, reserveSpots } = eventContent.fields;

  if (event.accepted.length < spots) return "yes";
  if (event.reserve.length < reserveSpots) return "reserve";
  return "no";
};

/**
 * Attempts to add an user to the given event.
 *
 * If there is room in the main spots, the user is enrolled.
 * If there is no room in the main spots, the user is enrolled as a reserve.
 * If there is no room in the reserve spots either, the user is not enrolled.
 */
const enrollUser = async (event: EnrollData, user: User) => {
  const available = await canEnroll(event);

  switch (available) {
    case "yes":
      await event.update({ $push: { accepted: user } }).exec();
      break;
    case "reserve":
      await event.update({ $push: { reserve: user } }).exec();
      break;
    case "no":
      throw new Error("event has no available spots");
  }
};

export const database = {
  init,
  createEnrollData,
  getEnrollData,
  canEnroll,
  addUser: enrollUser,
};
