import { Request } from "express";

export interface CustomRequest<T> extends Request {
  user?: T;
}
