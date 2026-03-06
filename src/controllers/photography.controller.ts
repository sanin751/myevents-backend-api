import { Request, Response } from "express";
import z from "zod";
import {
  CreatePhotographyPackageDTO,
  UpdatePhotographyPackageDTO
} from "../dtos/photography.dto";
import { PhotographyPackageService } from "../service/photography.service";

const photographyService = new PhotographyPackageService();

export class PhotographyPackageController {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreatePhotographyPackageDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const data = await photographyService.createPackage(parsed.data);

      return res.status(200).json({
        success: true,
        message: "Package created",
        data
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal Server Error"
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const parsed = UpdatePhotographyPackageDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const data = await photographyService.updatePackage(id, parsed.data);

      return res.status(200).json({
        success: true,
        message: "Package updated",
        data
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal Server Error"
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = await photographyService.getPackageById(id);

      return res.status(200).json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal Server Error"
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await photographyService.deletePackage(id);

      return res.status(200).json({
        success: true,
        message: "Package deleted"
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal Server Error"
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 10;
      const search = req.query.search as string;

      const data = await photographyService.getAllPackages(page, size, search);

      return res.status(200).json({
        success: true,
        ...data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }
}