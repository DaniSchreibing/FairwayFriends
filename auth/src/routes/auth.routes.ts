import * as express from "express";
import * as firebaseAuthController from "../controllers/firebase-auth.controller";
import { verifyToken, authorizeOwner } from "../middleware/auth.middleware";
import { register } from "../metrics/metrics";

const router = express.Router();

router.post('/register', firebaseAuthController.registerUser);
router.post('/login', firebaseAuthController.loginUser);
router.post('/logout', verifyToken, firebaseAuthController.logoutUser);
router.post('/reset-password', verifyToken, authorizeOwner, firebaseAuthController.resetPassword);
router.post('/delete-user', firebaseAuthController.removeUser);
router.get('/verify', verifyToken);

router.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;