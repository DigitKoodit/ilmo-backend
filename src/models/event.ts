import type { Document, ObjectId } from "mongoose";
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { User, userSchema } from "./user";

const enrollDataSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
    },
    accepted: {
      type: [userSchema],
      required: true,
    },
    reserve: {
      type: [userSchema],
      required: true,
    },
  },
  { collection: "enrollData" }
);

export interface EnrollData extends Document {
  slug: string;
  accepted: User[];
  reserve: User[];
}

enrollDataSchema.plugin(uniqueValidator);

const EnrollDataModel =
  mongoose.models["EnrollData"] ||
  mongoose.model<EnrollData>("EnrollData", enrollDataSchema);

export default EnrollDataModel;
