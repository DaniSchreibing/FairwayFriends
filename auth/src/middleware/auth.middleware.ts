import { Request, Response, NextFunction } from "express";
const { admin } = require("../firebase.config");

export interface CustomRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const idToken = req.cookies.access_token;
  if (!idToken) {
    res.status(403).json({ error: "No token provided" });
    return;
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    if (!decodedToken.email_verified){
      res.status(401).send('Your email needs to be verified.');
      return;
    }
    
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ error: "Unauthorized" });
    return;
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