import { User } from "../models/user";
import { EventEnrollForm } from "../types/contentful";
import { isArrayOfType } from "./array";

/**
 * **NOTE**: all fields in website3.0 -> `./src/components/EventEnrollForm/Fields/index.tsx` must have validation logic here.
 */
export const validateAndCleanUser = (
  enrollForm: EventEnrollForm,
  user: User
): User | null => {
  // all extra fields that pass the validation get added to this object.
  // that way any extra fields not present in the form are kept away from the database.
  const validatedExtraFields = {};

  for (const field of enrollForm.fields.fields) {
    const fieldName = field.fields.title;

    const userFieldValue = user.extraFields[fieldName];

    // all required fields must be present
    if (!user.extraFields.hasOwnProperty(fieldName)) {
      if (field.fields.required) {
        console.log("missing field:", fieldName);
        return null;
      }

      // skip optional fields that are not present
      continue;
    }

    // to type checking for all fields
    switch (field.sys.contentType.sys.id) {
      case "enrollFormTextField":
        if (typeof userFieldValue !== "string") {
          console.log("text field not a string:", fieldName);
          return null;
        }
        break;
      case "enrollFormMultipleChoice":
        // TODO: also check that number of choices match form constraints
        if (
          typeof userFieldValue !== "string" &&
          !isArrayOfType(userFieldValue, "string")
        ) {
          console.log("multiple choice not an array or string:", fieldName);
          return null;
        }
    }

    // add validated field to final object
    validatedExtraFields[fieldName] = userFieldValue;
  }

  user.extraFields = validatedExtraFields;
  return user;
};
