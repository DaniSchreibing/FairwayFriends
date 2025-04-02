import { AppDataSource } from "../data-source";
import { NextFunction, Request, response, Response } from "express";
import { User } from "../entity/User";
import { Equal } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export const deleteByUserID = async (userID: string) => {
  const userRepository = AppDataSource.getRepository(User);
  console.log("Deleting user with ID:", userID);
  // if (!isValidUUID(userID)) {
  //   throw new Error("Invalid UUID format");
  // }
  try {
    const userToRemove = await userRepository.findOne({
      where: { UserID: Equal(userID) },
    });
    if (!userToRemove) {
      throw new Error("User not found");
    }
    console.log("User found:", userToRemove);
    await userRepository.remove(userToRemove);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error deleting user: " + error.message);
    }
    throw new Error("Error deleting user: Unknown error");
  }
};

function isValidUUID(uuid_to_test: string): boolean {
  const regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid_to_test);
}
