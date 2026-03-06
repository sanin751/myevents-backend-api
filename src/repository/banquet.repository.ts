import { QueryFilter } from "mongoose";
import { IBanquet, BanquetModel } from "../models/banquet.model";

export interface IBanquetRepository {
  createBanquet(data: Partial<IBanquet>): Promise<IBanquet>;
  getBanquetById(id: string): Promise<IBanquet | null>;
  updateBanquet(id: string, data: Partial<IBanquet>): Promise<IBanquet | null>;
  deleteBanquet(id: string): Promise<boolean>;
  getAllBanquets(page: number, size: number, search?: string):
    Promise<{ banquets: IBanquet[]; total: number }>;
}

export class BanquetRepository implements IBanquetRepository {

  async createBanquet(data: Partial<IBanquet>): Promise<IBanquet> {
    const banquet = new BanquetModel(data);
    return await banquet.save();
  }

  async getBanquetById(id: string): Promise<IBanquet | null> {
    return await BanquetModel.findById(id);
  }

  async updateBanquet(id: string, data: Partial<IBanquet>): Promise<IBanquet | null> {
    return await BanquetModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBanquet(id: string): Promise<boolean> {
    const result = await BanquetModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async getAllBanquets(
    page: number,
    size: number,
    search?: string
  ): Promise<{ banquets: IBanquet[]; total: number }> {

    const filter: QueryFilter<IBanquet> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const [banquets, total] = await Promise.all([
      BanquetModel.find(filter)
        .skip((page - 1) * size)
        .limit(size),
      BanquetModel.countDocuments(filter)
    ]);

    return { banquets, total };
  }
}