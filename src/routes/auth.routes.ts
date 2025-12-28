import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createRateLimiter } from '../middlewares/rateLimiter';
import { API_VERSION, ROOT_PATH } from "../../constants/basePathRoutes";

const authRoutes = Router();

const otpLimiter = createRateLimiter();

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.AUTH;

authRoutes.post(`${BASE_PATH}/register`, authController.register);
authRoutes.post(`${BASE_PATH}/login`, authController.login);
authRoutes.post(
  `${BASE_PATH}/verify-otp`,
  otpLimiter,
  authController.verifyOtp,
);
authRoutes.get(`${BASE_PATH}/me`, authMiddleware, authController.me);

export { authRoutes };
