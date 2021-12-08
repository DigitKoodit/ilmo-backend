# ilmo-backend

Backend for the standalone ilmojärjestelmä

# API Reference

## GET `/api`

Health check. Always returns `200` status code and `ok` message body

## GET `/api/event/:slug`

Returns the enrollment data for one event. Replace `:slug` with the slug of the event you want to query.

(Example: slug: `suvisitsit` -> url: `/api/event/suvisitsit`)

### Return value:

```json
{
  // Slug of the event. Same as the :slug in the URL.
  "slug": "suvisitsit",

  // Array containing all users that are enrolled in the event in main spots.
  // These are the users that can attend the event when it's held.
  "main": [],

  // Array containing all users that are enrolled in the event in reserve spots.
  // Reserve spots are filled only after all the main spots are full.
  "reserve": []
}
```

## POST `/api/event/:slug`

Submits an enrollment to a specific event. Replace `:slug` with the slug of the event you want to enroll into.

(Example: slug: `suvisitsit` -> url: `/api/event/suvisitsit`)

### Return value:

```json
{
  // Slug of the event the user enrolled in. Same as :slug
  "slug": "suvisitsit",

  // User object that the client provided, after server has validated and cleaned it up.
  "user": {
    "firstName": "Joni",
    "lastName": "Inkivääri",
    "email": "jinki@utu.fi",

    // Timestamp of when the user was first enrolled to the event.
    // Convert this to a date object first before using it as a date.
    "dateEnrolled": "2021-12-08T21:26:25Z",

    // User choices given when submitting the form.
    // Every key is the ID of a form field in Contentful, and the value is the user's choice for that field.
    "extraFields": {
      "ol9i1237981n37987": "Alkoholiton",
      "lk1o9n283798794b1": "MGMT - Me and Michael"
    }
  },

  // Where the user was enrolled.
  // "main" means the user was successfully enrolled,
  // "reserve" means no main spots were left so the user was enrolled as a reserve.
  // "none" means both main and reserve spots were full, so the user was not enrolled.
  "enrollStatus": "main"
}
```
