import { NextFunction, Request, Response } from "express";
import * as profileService from "../services/user.service";

export const createProfile = async (req: Request, res: Response): Promise<void> => {
  try{
    const user = await profileService.createProfile(req.body);
    res.status(201).json(user);
  }catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export const getAllProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await profileService.getAllProfiles();
    if (!users) {
      res.status(404).json({ message: "Users not found" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProfileByID = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await profileService.getProfileByID(req.params.userID);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await profileService.updateProfile(req.params.userID, req.body);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await profileService.deleteByUserID(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await profileService.getRole(req.params.userID);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// export class UserController {
//   private userRepository = AppDataSource.getRepository(User);

//   async all(request: Request, response: Response, next: NextFunction) {
//     return this.userRepository.find();
//   }

//   async one(request: Request, response: Response, next: NextFunction) {
//     const id = request.params.id;

//     if (!this.isValidUUID(id)) {
//       return response.status(400).json({ error: "Invalid UUID format" });
//     }

//     const user = await this.userRepository.findOne({
//       where: { id: Equal(id) },
//     });

//     if (!user) {
//       return response.status(404).json({ error: "User not found" });
//     }
//     return user;
//   }

//   async save(request: Request, response: Response, next: NextFunction) {
//     const { firstName, lastName, age } = request.body;

//     const user = new User();
//     user.id = uuidv4(); // Automatically generate UUID

//     Object.assign(user, {
//       firstName,
//       lastName,
//       age,
//     });

//     return this.userRepository.save(user);
//   }

//   async update(request: Request, response: Response, next: NextFunction) {
//     const id = request.params.id;

//     if (!this.isValidUUID(id)) {
//       return response.status(400).json({ error: "Invalid UUID format" });
//     }

//     const userToUpdate = await this.userRepository.findOne({
//       where: { id: Equal(id) },
//     });

//     if (!userToUpdate) {
//       return response.status(404).json({ error: "User not found" });
//     }

//     const { firstName, lastName, age } = request.body;

//     Object.assign(userToUpdate, {
//       firstName,
//       lastName,
//       age,
//     });

//     return this.userRepository.save(userToUpdate);
//   }

//   async remove(request: Request, response: Response, next: NextFunction) {
//     const id = request.params.id;

//     if (!this.isValidUUID(id)) {
//       return response.status(400).json({ error: "Invalid UUID format" });
//     }

//     const userToRemove = await this.userRepository.findOne({
//       where: {
//         id: Equal(id), // Use TypeORM's Equal operator
//       },
//     });

//     if (!userToRemove) {
//       return response.status(404).json({ error: "User not found" });
//     }

//     await this.userRepository.remove(userToRemove);

//     return response.status(200).json({ message: "User was deleted succesfully!" });
//   }

//   async removeByUserID(request: Request, response: Response, next: NextFunction) {
//     const UserID = request.params.UserID;

//     if (!this.isValidUUID(UserID)) {
//       return response.status(400).json({ error: "Invalid UUID format" });
//     }
//     const userToRemove = await this.userRepository.findOne({
//       where: {
//         UserID: Equal(UserID)
//       },
//     });
//     if (!userToRemove) {
//       return response.status(404).json({ error: "User not found" });
//     }
//     await this.userRepository.remove(userToRemove);
//     return response.status(200).json({ message: "User was deleted succesfully!" });
//   }


//   private isValidUUID(uuid_to_test: string): boolean {
//     const regex =
//       /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//     return regex.test(uuid_to_test);
//   }
// }
