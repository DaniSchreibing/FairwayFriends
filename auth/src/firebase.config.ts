import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../.env") });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
// const admin = require("firebase-admin");
// const serviceAccount = require("../FirebaseService.json");

// firebase.initializeApp(firebaseConfig);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const app = initializeApp(firebaseConfig);

const serviceAccount = require("../FirebaseService.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  admin,
};
