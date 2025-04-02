import * as express from "express";
import * as interactionController from "../controllers/interaction.controller";

const router = express.Router();

router.post("/", interactionController.createInteraction);
router.get("/", interactionController.getInteractions);
router.get("/:userID", interactionController.getInteractionFromUserID);
router.delete("/:id", interactionController.deleteInteraction);
router.delete("/userID/:userID", interactionController.deleteByUserID);

export default router;