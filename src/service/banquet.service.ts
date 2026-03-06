import { BanquetRepository } from "../repository/banquet.repository";
import { CreateBanquetDTO, UpdateBanquetDTO } from "../dtos/banquet.dto";
import { HttpError } from "../error/http-error";

const banquetRepository = new BanquetRepository();

export class BanquetService {

  async createBanquet(data: any) {
    return await banquetRepository.createBanquet(data);
  }

  async getBanquetById(id: string) {

    const banquet = await banquetRepository.getBanquetById(id);

    if (!banquet) {
      throw new HttpError(404, "Banquet not found");
    }

    return banquet;
  }

  async updateBanquet(id: string, data: Partial<UpdateBanquetDTO>) {

    const updated = await banquetRepository.updateBanquet(id, data);

    if (!updated) {
      throw new HttpError(404, "Banquet not found");
    }

    return updated;
  }

  async deleteBanquet(id: string) {

    const deleted = await banquetRepository.deleteBanquet(id);

    if (!deleted) {
      throw new HttpError(404, "Banquet not found");
    }

    return true;
  }

  async getAllBanquets(page: number, size: number, search?: string) {
    return await banquetRepository.getAllBanquets(page, size, search);
  }
}