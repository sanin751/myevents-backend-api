import mongoose, { Document, Schema } from "mongoose";
import { PhotographyPackageType } from "../types/photography.type";

const PhotographyPackageSchema: Schema = new Schema<PhotographyPackageType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: String },
    features: [{ type: String }],
    image: { type: String },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export interface IPhotographyPackage extends PhotographyPackageType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const PhotographyPackageModel = mongoose.model<IPhotographyPackage>(
  "PhotographyPackage",
  PhotographyPackageSchema
);