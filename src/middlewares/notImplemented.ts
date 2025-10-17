import { NextFunction, Request, Response } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { STATUS_CODE } from "../constants/statusCode";
import path from "path";

export const notImplemented = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  const publicPath = path.join(__dirname, "../../public");
  if (!req.url.startsWith("/api")) {
    return res.sendFile(path.join(publicPath, "index.html"));
  }

  return res.status(STATUS_CODE.NOT_IMPLEMENTED).send({
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
