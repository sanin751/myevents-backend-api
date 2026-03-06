import { DecorationRepository } from "../repository/decoration.repository";
import {
  CreateDecorationDTO,
  UpdateDecorationDTO
} from "../dtos/decoration.dto";
import { HttpError } from "../error/http-error";

let decorationRepository = new DecorationRepository();

export class DecorationService {

  async createDecoration(data: CreateDecorationDTO) {
    return await decorationRepository.createDecoration(data);
  }

  async getDecorationById(id: string) {
    const decoration = await decorationRepository.getDecorationById(id);
    if (!decoration) {
      throw new HttpError(404, "Decoration not found");
    }
    return decoration;
  }

  async updateDecoration(id: string, data: UpdateDecorationDTO) {
    const updated = await decorationRepository.updateDecoration(id, data);
    if (!updated) {
      throw new HttpError(404, "Decoration not found");
    }
    return updated;
  }

  async deleteDecoration(id: string) {
    const deleted = await decorationRepository.deleteDecoration(id);
    if (!deleted) {
      throw new HttpError(404, "Decoration not found");
    }
    return true;
  }

  async getAllDecorations(page: number, size: number, search?: string) {
    return await decorationRepository.getAllDecorations(page, size, search);
  }
}