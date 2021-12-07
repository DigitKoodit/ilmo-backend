import mongoose from "mongoose";

export const initDatabase = async () => {
  // TODO: connect to MongoDB
  await mongoose.connect(process.env.DB_URI);

  return null;
};
