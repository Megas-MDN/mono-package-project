import { UserModel } from "../models/UserModel";
import { querySchema } from "../validations/Queries/listAll";
import { createUserSchema } from "../validations/User/createUserSchema";
import { updateUserSchema } from "../validations/User/updateUserSchema";

export class UserService {
  private userModel = new UserModel()

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.userModel.listAll(validQuery);
  }
    
  async getById(idUser: number) {
    return this.userModel.getById(idUser);
  }

  async create(data: unknown) {
    const validData = createUserSchema.parse(data);
    return this.userModel.create(validData);
  }

  async update(idUser: number, data: unknown) {
    const validData = updateUserSchema.parse(data);
    return this.userModel.update(idUser, validData);
  }

  async delete(idUser: number) {
    return this.userModel.delete(idUser);
  }
}