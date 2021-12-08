import { Response } from "express";

export const responseMessage = (
  res: Response,
  status: number,
  message: string
) => {
  return res.status(status).json({ status, message });
};
