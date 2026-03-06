import mongoose, { Document, Schema } from "mongoose";
import { BanquetType } from "../types/banquet.type";

const BanquetSchema: Schema = new Schema<BanquetType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    isAvailable: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export interface IBanquet extends BanquetType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const BanquetModel = mongoose.model<IBanquet>("Banquet", BanquetSchema);