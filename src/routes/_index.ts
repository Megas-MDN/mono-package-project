import { Router } from "express";
import { userRoutes } from "./user.routes";
import { postRoutes } from "./post.routes";
import { authRoutes } from "./auth.routes";

export const routes = Router();
routes.use(authRoutes);
routes.use(userRoutes);
routes.use(postRoutes);
