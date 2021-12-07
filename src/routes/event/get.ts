import { RequestHandler } from "express";

/**
 * GET `/api/event/:slug`
 */
export const eventGetHandler: RequestHandler<{ slug: string }> = (req, res) => {
  const { slug } = req.params;

  return res.status(200).json({ slug: slug ?? "no" });
};
