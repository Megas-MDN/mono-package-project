import { Router } from "express";
import { PostController } from "../controllers/PostController";

import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.POST; 

const postRoutes = Router();

const postController = new PostController();

postRoutes.get(`${BASE_PATH}`, async (req, res) => {
  await postController.listAll(req, res);
});
postRoutes.get(`${API_VERSION.V1 + ROOT_PATH.POSTS}`, async (req, res) => {
  await postController.listAll(req, res);
});

postRoutes.get(`${BASE_PATH}/:idPost`, async (req, res) => {
  await postController.getById(req, res);
});

postRoutes.post(`${BASE_PATH}`, async (req, res) => {
  await postController.create(req, res);
});

postRoutes.put(`${BASE_PATH}/:idPost`, async (req, res) => {
  await postController.update(req, res);
});

postRoutes.delete(`${BASE_PATH}/:idPost`, async (req, res) => {
  await postController.delete(req, res);
});

export { postRoutes };
