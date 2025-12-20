import { Router } from "express";
import { userRoutes } from "./user.routes";
import { postRoutes } from "./post.routes";

export const routes = Router();
routes.use(userRoutes);
routes.use(postRoutes);
