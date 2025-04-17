import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Equal } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export const createProfile = async (userData: User) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    // user.UserID = uuidv4(); // Automatically generate UUID

    Object.assign(user, userData);

    await userRepository.save(user);
    return user;
  } catch (error) {
    throw new Error("Error creating user: " + error);
  }
}

export const getAllProfiles = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    return users;
  } catch (error) {
    throw new Error("Error getting users: " + error);
  }
}

export const getProfileByID = async (userID: string) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { UserID: Equal(userID) },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error getting user: " + error.message);
    }
    throw new Error("Error getting user: Unknown error");
  }
};

export const updateProfile = async (userID: string, userData: User) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userToUpdate = await userRepository.findOne({
      where: { UserID: Equal(userID) },
    });
    if (!userToUpdate) {
      throw new Error("User not found");
    }
    Object.assign(userToUpdate, userData);
    await userRepository.save(userToUpdate);
    return userToUpdate;
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error("Error updating user: " + error.message);
    }
    throw new Error("Error updating user: Unknown error");
  }
};

export const deleteByUserID = async (userID: string) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userToRemove = await userRepository.findOne({
      where: { UserID: Equal(userID) },
    });
    if (!userToRemove) {
      throw new Error("User not found");
    }
    await userRepository.remove(userToRemove);
    return userToRemove;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error deleting user: " + error.message);
    }
    throw new Error("Error deleting user: Unknown error");
  }
};

export const getRole = async (userID: string) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { UserID: Equal(userID) },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user.Role;
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error("Error getting user: " + error.message);
    }
    throw new Error("Error getting user: Unknown error");
  }
};

function isValidUUID(uuid_to_test: string): boolean {
  const regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid_to_test);
}
