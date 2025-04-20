import * as express from "express";
import * as firebaseAuthController from "../controllers/firebase-auth.controller";
import { verifyToken, authorizeOwner } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/register', firebaseAuthController.registerUser);
router.post('/login', firebaseAuthController.loginUser);
router.post('/logout', verifyToken, firebaseAuthController.logoutUser);
router.post('/reset-password', verifyToken, authorizeOwner, firebaseAuthController.resetPassword);
router.post('/delete-user', firebaseAuthController.removeUser);
router.get('/verify', verifyToken);

export default router;