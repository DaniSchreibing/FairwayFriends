import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { Equal } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    if (!this.isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid UUID format" });
    }

    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
    });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age } = request.body;

    const user = new User();
    user.id = uuidv4(); // Automatically generate UUID

    Object.assign(user, {
      firstName,
      lastName,
      age,
    });

    return this.userRepository.save(user);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    if (!this.isValidUUID(id)) {
      return response.status(400).json({ error: "Invalid UUID format" });
    }

    const userToRemove = await this.userRepository.findOne({
      where: {
        id: Equal(id), // Use TypeORM's Equal operator
      },
    });

    if (!userToRemove) {
      return response.status(404).json({ error: "User not found" });
    }

    await this.userRepository.remove(userToRemove);

    return response.status(200).json({ message: "User was deleted succesfully!" });
  }

  async removeByUserID(request: Request, response: Response, next: NextFunction) {
    const UserID = request.params.UserID;

    if (!this.isValidUUID(UserID)) {
      return response.status(400).json({ error: "Invalid UUID format" });
    }
    const userToRemove = await this.userRepository.findOne({
      where: {
        UserID: Equal(UserID)
      },
    });
    if (!userToRemove) {
      return response.status(404).json({ error: "User not found" });
    }
    await this.userRepository.remove(userToRemove);
    return response.status(200).json({ message: "User was deleted succesfully!" });
  }


  private isValidUUID(uuid_to_test: string): boolean {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid_to_test);
  }
}
