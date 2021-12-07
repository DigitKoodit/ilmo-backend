export type EnrollmentData = {
  enrolled: Person[];
  reserve: Person[];
};

export type Person = {
  id: string;
  name: string;
  email: string;
  extraInfo?: Record<string, any>;
};
