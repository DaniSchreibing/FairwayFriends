import * as express from "express";
import * as profileController from "../controllers/UserController";
import { authenticateRequest, authorizeOwner, authorizeAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", profileController.createProfile);
router.get("/", authenticateRequest, authorizeAdmin, profileController.getAllProfiles);
router.get("/:userID", authenticateRequest, authorizeOwner, profileController.getProfileByID);
router.delete("/userID/:userID", authenticateRequest, authorizeOwner, profileController.deleteProfile);

export default router;