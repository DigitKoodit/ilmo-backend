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
  extraFields: {
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
  extraFields: { [key: string]: string | string[] };
  dateEnrolled: Date;
}

userSchema.plugin(uniqueValidator);

export const isUser = (v: unknown): v is User => {
  return (
    !!v &&
    v instanceof Object &&
    v.hasOwnProperty("firstName") &&
    typeof v["firstName"] === "string" &&
    v.hasOwnProperty("lastName") &&
    typeof v["lastName"] === "string" &&
    v.hasOwnProperty("email") &&
    typeof v["email"] === "string" &&
    v.hasOwnProperty("extraFields") &&
    typeof v["extraFields"] === "object" &&
    v.hasOwnProperty("dateEnrolled") &&
    (typeof v["dateEnrolled"] === "string" || v["dateEnrolled"] instanceof Date)
  );
};
