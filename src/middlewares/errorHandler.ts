import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: { status?: number; message?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    res
      .status(err.status || 500)
      .send({ message: err.message || "Internal Server Error" });
  } catch (er) {
    let message = "Internal Server Error";
    if (er instanceof Error) message = er.message;
    res.status(500).send({
      message: "Unknow Error",
      error: message,
      err,
      er,
    });
  }
};
