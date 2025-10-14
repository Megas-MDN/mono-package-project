import { NextFunction, Request, Response } from "express";

export const autoDeploy = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, body, query } = req;
  if (!url.endsWith("/api/deploy/github")) return next();
  if (method !== "POST") return next();
  console.log(`Fazendo Deploy em: ${new Date()}`);
  res.status(200).json({ message: `Deploy Done In: ${new Date()}` });
  return;
};
