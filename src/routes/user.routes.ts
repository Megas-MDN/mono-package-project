import { Router } from "express";
import { UserController } from "../controllers/UserController";

import { API_VERSION, ROOT_PATH } from "../../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER; // /api/v1/user

const userRoutes = Router();

const userController = new UserController();

userRoutes.get(`${BASE_PATH}`, async (req, res) => {
  await userController.listAll(req, res);
});
userRoutes.get(`${API_VERSION.V1 + ROOT_PATH.USERS}`, async (req, res) => {
  await userController.listAll(req, res);
});

userRoutes.get(`${BASE_PATH}/:idUser`, async (req, res) => {
  await userController.getById(req, res);
});

userRoutes.post(`${BASE_PATH}`, async (req, res) => {
  await userController.create(req, res);
});

userRoutes.put(`${BASE_PATH}/:idUser`, async (req, res) => {
  await userController.update(req, res);
});

userRoutes.delete(`${BASE_PATH}/:idUser`, async (req, res) => {
  await userController.delete(req, res);
});

export { userRoutes };
