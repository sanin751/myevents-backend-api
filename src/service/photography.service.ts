import {
  CreatePhotographyPackageDTO,
  UpdatePhotographyPackageDTO
} from "../dtos/photography.dto";
import { PhotographyPackageRepository } from "../repository/photography.repository";
import { HttpError } from "../error/http-error";

const photographyRepository = new PhotographyPackageRepository();

export class PhotographyPackageService {
  async createPackage(data: CreatePhotographyPackageDTO) {
    return await photographyRepository.create(data);
  }

  async updatePackage(id: string, data: Partial<UpdatePhotographyPackageDTO>) {
    const updated = await photographyRepository.update(id, data);
    if (!updated) {
      throw new HttpError(404, "Package not found");
    }
    return updated;
  }

  async getPackageById(id: string) {
    const pkg = await photographyRepository.getById(id);
    if (!pkg) {
      throw new HttpError(404, "Package not found");
    }
    return pkg;
  }

  async deletePackage(id: string) {
    const deleted = await photographyRepository.delete(id);
    if (!deleted) {
      throw new HttpError(404, "Package not found");
    }
    return true;
  }

  async getAllPackages(page: number, size: number, search?: string) {
    return await photographyRepository.getAll(page, size, search);
  }
}