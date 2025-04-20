import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/user.service";
import { UserRole } from "../entity/Roles.enum";

export interface CustomRequest extends Request {
  user?: any;
}

const serviceAccount = require("../../FirebaseService.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const authenticateRequest = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
      return;
    }
    const decodedToken = await admin.auth().verifyIdToken(access_token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ error: "Unauthorized" });
  }
};

export const authorizeOwner = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userID || req.body.userID;

  if (req.user.uid !== userId) {
    console.log("User ID mismatch:", req.user.uid, userId);
    res.status(403).json({
      error: "Forbidden",
      message: "You do not have permission to access this profile",
    });
    return;
  }
  next();
};

export const authorizeAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const role = await profileService.getRole(req.user.uid);
  
  if (!role || role != UserRole.ADMIN) {
    console.log("User is not an admin:", role);
    res.status(403).json({
      error: "Forbidden",
      message: "You do not have permission to perform this action",
    });
    return;
  }
  next();
};
