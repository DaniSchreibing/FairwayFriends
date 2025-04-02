import mongoose, { Document, Schema } from "mongoose";

export interface IInteraction extends Document {
  objectID: string;
  type: string;
  userID: string;
  createdAt: Date;
  comment: string;
  name: string;
}
