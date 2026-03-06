import { QueryFilter } from "mongoose";
import {
  IPhotographyPackage,
  PhotographyPackageModel
} from "../models/photography.model";

export interface IPhotographyPackageRepository {
  create(data: Partial<IPhotographyPackage>): Promise<IPhotographyPackage>;
  getById(id: string): Promise<IPhotographyPackage | null>;
  update(id: string, data: Partial<IPhotographyPackage>): Promise<IPhotographyPackage | null>;
  delete(id: string): Promise<boolean>;
  getAll(page: number, size: number, search?: string): Promise<{
    packages: IPhotographyPackage[];
    total: number;
  }>;
}

export class PhotographyPackageRepository
  implements IPhotographyPackageRepository
{
  async create(data: Partial<IPhotographyPackage>) {
    const pkg = new PhotographyPackageModel(data);
    return await pkg.save();
  }

  async getById(id: string) {
    return await PhotographyPackageModel.findById(id);
  }

  async update(id: string, data: Partial<IPhotographyPackage>) {
    return await PhotographyPackageModel.findByIdAndUpdate(id, data, {
      new: true
    });
  }

  async delete(id: string) {
    const result = await PhotographyPackageModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async getAll(page: number, size: number, search?: string) {
    const filter: QueryFilter<IPhotographyPackage> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const [packages, total] = await Promise.all([
      PhotographyPackageModel.find(filter)
        .skip((page - 1) * size)
        .limit(size),
      PhotographyPackageModel.countDocuments(filter)
    ]);

    return { packages, total };
  }
}