import type { Document } from "mongoose";
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  extraInfo: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  dateEnrolled: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  extraInfo: Record<string, any>;
  dateEnrolled: Date;
}

userSchema.plugin(uniqueValidator);
