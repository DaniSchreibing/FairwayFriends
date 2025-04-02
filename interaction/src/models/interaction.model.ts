import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IInteraction } from "../interfaces/interaction.interface";

const InteractionSchema = new Schema<IInteraction>({
  objectID: { type: String, required: true, default: () => uuidv4() },
  type: { type: String, required: true },
  userID: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  comment: { type: String, required: true },
  name: { type: String, required: true },
});

const Interaction = mongoose.model<IInteraction>(
  "Interaction",
  InteractionSchema
);
export default Interaction;
