import { RequestHandler } from "express";

/**
 * POST `/api/event/:slug`
 */
export const eventPostHandler: RequestHandler<{ slug: string }> = (
  req,
  res
) => {
  const { slug } = req.params;

  return res.status(200).json({ slug });
};
