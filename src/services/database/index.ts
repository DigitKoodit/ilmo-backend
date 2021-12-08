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
  return await EnrollDataModel.create({ slug, main: [], reserve: [] });
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
): Promise<"main" | "reserve" | "none"> => {
  // fetch cached event info from Contentful
  const eventContent = await getEventContentCached(event.slug);
  if (!eventContent) {
    throw new Error("event not found");
  }

  const { spots, reserveSpots } = eventContent.fields;

  if (event.main.length < spots) return "main";
  if (event.reserve.length < reserveSpots) return "reserve";
  return "none";
};

/**
 * Attempts to add an user to the given event.
 *
 * If there is room in the main spots, the user is enrolled.
 * If there is no room in the main spots, the user is enrolled as a reserve.
 * If there is no room in the reserve spots either, the user is not enrolled.
 */
const enrollUser = async (
  event: EnrollData,
  user: User
): Promise<"main" | "reserve" | "none"> => {
  const available = await canEnroll(event);

  switch (available) {
    case "main":
      await event.updateOne({ $push: { main: user } }).exec();
      break;
    case "reserve":
      await event.updateOne({ $push: { reserve: user } }).exec();
      break;
    case "none":
      break;
  }

  return available;
};

/**
 * Checks if the user has already enrolled in the given event
 */
const userEnrollStatus = (
  event: EnrollData,
  email: string
): "main" | "reserve" | "none" => {
  if (event.main.find((u) => u.email === email)) return "main";
  if (event.reserve.find((u) => u.email === email)) return "reserve";
  return "none";
};

export const database = {
  init,
  createEnrollData,
  getEnrollData,
  canEnroll,
  enrollUser,
  userEnrollStatus,
};
