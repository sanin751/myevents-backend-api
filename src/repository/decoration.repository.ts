import { QueryFilter } from "mongoose";
import { IDecoration, DecorationModel } from "../models/decoration.model";

export interface IDecorationRepository {
  createDecoration(data: Partial<IDecoration>): Promise<IDecoration>;
  getDecorationById(id: string): Promise<IDecoration | null>;
  updateDecoration(id: string, data: Partial<IDecoration>): Promise<IDecoration | null>;
  deleteDecoration(id: string): Promise<boolean>;
  getAllDecorations(
    page: number,
    size: number,
    search?: string
  ): Promise<{ decorations: IDecoration[]; total: number }>;
}

export class DecorationRepository implements IDecorationRepository {

  async createDecoration(data: Partial<IDecoration>): Promise<IDecoration> {
    const decoration = new DecorationModel(data);
    return await decoration.save();
  }

  async getDecorationById(id: string): Promise<IDecoration | null> {
    return await DecorationModel.findById(id);
  }

  async updateDecoration(
    id: string,
    data: Partial<IDecoration>
  ): Promise<IDecoration | null> {
    return await DecorationModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteDecoration(id: string): Promise<boolean> {
    const result = await DecorationModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async getAllDecorations(
    page: number,
    size: number,
    search?: string
  ): Promise<{ decorations: IDecoration[]; total: number }> {

    const filter: QueryFilter<IDecoration> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const [decorations, total] = await Promise.all([
      DecorationModel.find(filter)
        .skip((page - 1) * size)
        .limit(size),
      DecorationModel.countDocuments(filter)
    ]);

    return { decorations, total };
  }
}