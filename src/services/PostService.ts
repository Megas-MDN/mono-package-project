import { PostModel } from "../models/PostModel";
import { querySchema } from "../validations/Queries/listAll";
import { createPostSchema } from "../validations/Post/createPostSchema";
import { updatePostSchema } from "../validations/Post/updatePostSchema";

export class PostService {
  private postModel = new PostModel()

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.postModel.listAll(validQuery);
  }
    
  async getById(idPost: number) {
    return this.postModel.getById(idPost);
  }

  async create(data: unknown) {
    const validData = createPostSchema.parse(data);
    return this.postModel.create(validData);
  }

  async update(idPost: number, data: unknown) {
    const validData = updatePostSchema.parse(data);
    return this.postModel.update(idPost, validData);
  }

  async delete(idPost: number) {
    return this.postModel.delete(idPost);
  }
}
