import mongoose, { Schema, Document } from "mongoose";
import { DecorationType } from "../types/decoration.type";

const DecorationSchemaModel: Schema = new Schema<DecorationType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export interface IDecoration extends DecorationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const DecorationModel = mongoose.model<IDecoration>(
  "Decoration",
  DecorationSchemaModel
);