import { prisma } from "../db/prisma";
import { TQuery } from "../validations/Queries/listAll";
import { TCreatePost } from "../validations/Post/createPostSchema";
import { TUpdatePost } from "../validations/Post/updatePostSchema";

export class PostModel {
  async totalCount(query: TQuery) {
    return prisma.post.count({
      where: {
        title: { contains: query.search },
      },
    });
  }

  async listAll(query: TQuery) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({ [field]: direction })) ||
      [];

    const result = await prisma.post.findMany({
      where: {
        title: { contains: query.search },
      },
      take: limit || undefined,
      skip,
      orderBy,
      include: {
        author: true, 
      }
    });

    const totalCount = await this.totalCount(query);
    return { result, totalCount };
  }

  async getById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });
  }

  async create(data: TCreatePost) {
    return prisma.post.create({ data });
  }

  async update(id: number, data: TUpdatePost) {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  }
}
