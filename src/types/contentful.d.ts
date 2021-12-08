import { Asset, Entry } from "contentful";

export type EventContent = Entry<{
  name: string;
  slug: string;
  coverImage?: Asset;
  description?: MarkdownContent;
  spots: number;
  reserveSpots?: number;
  enrollStart: string;
  enrollEnd: string;
  enrollForm: EventEnrollForm;
  enrollmentEnabled: boolean;
}>;

export type EventEnrollForm = Entry<{
  name: string;
  fields?: EventEnrollFormFields[];
}>;

export type EnrollFormTextField = Entry<{
  title: string;
  required: boolean;
}>;

export type EnrollFormMultipleChoice = Entry<{
  title: string;
  items: string[];
  maxNumberOfChoices: number;
  required: boolean;
}>;

export type EventEnrollFormFields =
  | EnrollFormTextField
  | EnrollFormMultipleChoice;

export type MarkdownContent = Entry<{
  subHeading: string;
  content: string;
}>;
