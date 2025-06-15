import { Request, Response } from "express";
import firebase from "firebase/app";
import { sendProfileData } from "../services/rabbitmq.service";
import * as rabbitMQService from "../services/rabbitmq.service";
import { failedLoginAttempts, successfullLogins } from "../metrics/metrics";
import * as datefns from "date-fns";
import * as dateFnsTz from "date-fns-tz";

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  admin,
} = require("../firebase.config");

const auth = getAuth();

export const registerUser = (req: Request, res: Response) => {
  const { email, password } = req.body.registerData;
  if (!email || !password) {
    res.status(422).json({
      email: "Email is required",
      password: "Password is required",
    });
  }
  //TODO: https://firebase.google.com/docs/auth/admin/manage-users#node.js_2 Using the Admin SDK to delete a user based on their UID!
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential: any) => {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          const profileData = {
            UserID: userCredential.user.uid,
            ...req.body.profileData,
          };
          res.status(201).json({
            message: "Verification email sent! User created successfully!",
          });

          sendProfileData(profileData);
          console.log("Profile data sent to RabbitMQ:", profileData);

          // //TODO: Test this
          // rabbitMQService.connectWithRetry(5, 5000, (error, connection) => {
          //   rabbitMQService.listenToFailedProfileCreation(connection, (message) => {
          //     const userId = (() => {
          //       try {
          //         return JSON.parse(message).UserID;
          //       } catch {
          //         return null;
          //       }
          //     })();
          //     console.log("Received message:", userId);
          //     //TODO: See if this works as im doubtful about the use of admin here
          //     admin.getAuth().deleteUser(userId)
          //       .then(() => {
          //         console.log("User deleted successfully:", userId);
          //       })
          //       .catch((error: any) => {
          //         console.error("Error deleting user:", error);
          //       });
          //   });
          // })
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
          secure: true,
          sameSite: "none",
        });

        successfullLogins.inc();

        res
          .status(200)
          .json({ message: "User logged in successfully", userCredential });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    })
    .catch((error: any) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      failedLoginAttempts.labels(email, error.code, dateFnsTz.formatInTimeZone(new Date(), 'Europe/Amsterdam', 'yyyy-MM-dd HH:mm zzz')).inc();

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
