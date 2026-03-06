import { Request, Response } from "express";
import { BanquetService } from "../service/banquet.service";
import { CreateBanquetDTO, UpdateBanquetDTO } from "../dtos/banquet.dto";
import z from "zod";

const banquetService = new BanquetService();

export class BanquetController {

  async createBanquet(req: Request, res: Response) {
    try {

      const parsedData = CreateBanquetDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error)
        });
      }

      const image = req.file ? req.file.filename : undefined;

      const banquet = await banquetService.createBanquet({
        ...parsedData.data,
        image
      });

      return res.status(201).json({
        success: true,
        message: "Banquet created",
        data: banquet
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message ?? "Internal Server Error"
      });

    }
  }

  async getAllBanquets(req: Request, res: Response) {
    try {

      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 10;
      const search = req.query.search as string;

      const result = await banquetService.getAllBanquets(page, size, search);

      return res.status(200).json({
        success: true,
        ...result
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }
  }

  async getBanquetById(req: Request, res: Response) {
    try {

      const banquet = await banquetService.getBanquetById(req.params.id);

      return res.status(200).json({
        success: true,
        data: banquet
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });

    }
  }

  async updateBanquet(req: Request, res: Response) {
    try {

      const parsedData = UpdateBanquetDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error)
        });
      }

      const image = req.file ? req.file.filename : undefined;

      const updated = await banquetService.updateBanquet(
        req.params.id,
        {
          ...parsedData.data,
          ...(image && { image })
        }
      );

      return res.status(200).json({
        success: true,
        message: "Banquet updated",
        data: updated
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });

    }
  }

  async deleteBanquet(req: Request, res: Response) {
    try {

      await banquetService.deleteBanquet(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Banquet deleted"
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });

    }
  }
}