import { NextFunction, Request, Response } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { STATUS_CODE } from "../constants/statusCode";

export const notImplemented = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  return next({
    status: STATUS_CODE.NOT_IMPLEMENTED,
    message: "Route not Implemented",
    url: req.url,
    method: req.method,
    host: `${req.protocol}://${req.hostname}:${process.env.PORT || 3001}`,
    api_version: API_VERSION.MAIN,
    root_options: ROOT_PATH,
    authorization,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
};
