import { Request, Response } from "express";
import firebase from "firebase/app";

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
} = require("../firebase.config");

const auth = getAuth();

export const registerUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({
      email: "Email is required",
      password: "Password is required",
    });
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential: any) => {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          res.status(201).json({
            message: "Verification email sent! User created successfully!",
          });
        })
        .catch((error: any) => {
          console.error(error);
          res.status(500).json({ error: "Error sending email verification" });
        });
    })
    .catch((error: any) => {
      const errorMessage =
        error.message || "An error occurred while registering user";
      res.status(500).json({ error: errorMessage });
    });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({
      email: "Email is required",
      password: "Password is required",
    });
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential: any) => {
      const idToken = userCredential._tokenResponse.idToken;
      if (idToken) {
        res.cookie("access_token", idToken, {
          httpOnly: true,
        });
        res
          .status(200)
          .json({ message: "User logged in successfully", userCredential });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    })
    .catch((error: any) => {
      console.error(error);
      const errorMessage =
        error.message || "An error occurred while logging in";
      res.status(500).json({ error: errorMessage });
    });
};

export const logoutUser = (req: Request, res: Response) => {
  signOut(auth)
    .then(() => {
      res.clearCookie("access_token");
      res.status(200).json({ message: "User logged out successfully" });
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export const resetPassword = (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(422).json({
      email: "Email is required",
    });
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      res
        .status(200)
        .json({ message: "Password reset email sent successfully!" });
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export const removeUser = (req: Request, res: Response) => {
  deleteUser(getAuth().currentUser)
    .then(() => {
      res.clearCookie("access_token");
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
