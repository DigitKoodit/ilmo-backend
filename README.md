# ilmo-backend

Backend for the standalone ilmojärjestelmä

# API Reference

## GET `/api`

Health check. Always returns `200` status code and `ok` message body

## GET `/api/event/:slug`

Returns the enrollment data for one event. Replace `slug` with the slug of the event you want info for.

## POST `/api/event/:slug`

Submits an enrollment to a specific event. Replace `slug` with the slug of the event you want to enroll into.

Example:

- slug: `suvisitsit` -> url: `/api/event/suvisitsit/enroll`
