import { prisma } from "../db/prisma";
import { TQuery } from "../validations/Queries/listAll";
import { TCreateUser } from "../validations/User/createUserSchema";
import { TUpdateUser } from "../validations/User/updateUserSchema";

export class UserModel {
  async totalCount(query: TQuery) {
    return prisma.user.count({
      where: {
        name: { contains: query.search },
      },
    });
  }

  async listAll(query: TQuery) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({ [field]: direction })) ||
      [];

    const result = await prisma.user.findMany({
      where: {
        name: { contains: query.search },
      },
      take: limit || undefined,
      skip,
      orderBy,
      include: {
        posts: true,
      }
    });

    const totalCount = await this.totalCount(query);
    return { result, totalCount };
  }

  async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: true }
    });
  }

  async create(data: TCreateUser) {
    return prisma.user.create({ data });
  }

  async update(id: number, data: TUpdateUser) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
