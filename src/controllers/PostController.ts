import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { PostService } from "../services/PostService";
import { STATUS_CODE } from "../constants/statusCode";

export class PostController {
  private postService = new PostService();

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.postService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }
  
  async getById(req: CustomRequest<unknown>, res: Response) {
    const result = await this.postService.getById(Number(req.params.idPost));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async create(req: CustomRequest<unknown>, res: Response) {
    const result = await this.postService.create(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async update(req: CustomRequest<unknown>, res: Response) {
    const result = await this.postService.update(
      Number(req.params.idPost),
      req.body
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async delete(req: CustomRequest<unknown>, res: Response) {
    const result = await this.postService.delete(Number(req.params.idPost));
    return res.status(STATUS_CODE.OK).json(result);
  }
}
