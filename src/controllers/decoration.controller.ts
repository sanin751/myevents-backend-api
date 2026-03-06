import { Request, Response } from "express";
import { DecorationService } from "../service/decoration.service";
import {
  CreateDecorationDTO,
  UpdateDecorationDTO
} from "../dtos/decoration.dto";
import z from "zod";

let decorationService = new DecorationService();

export class DecorationController {

  async createDecoration(req: Request, res: Response) {
    try {
      const parsedData = CreateDecorationDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error)
        });
      }

      if (req.file) {
        parsedData.data.image = `/uploads/${req.file.filename}`;
      }

      const decoration = await decorationService.createDecoration(parsedData.data);

      return res.status(200).json({
        success: true,
        message: "Decoration created",
        data: decoration
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async getAllDecorations(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 10;
      const search = req.query.search as string;

      const result = await decorationService.getAllDecorations(page, size, search);

      return res.status(200).json({
        success: true,
        ...result
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async getDecorationById(req: Request, res: Response) {
    try {
      const decoration = await decorationService.getDecorationById(req.params.id);

      return res.status(200).json({
        success: true,
        data: decoration
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateDecoration(req: Request, res: Response) {
    try {
      const parsedData = UpdateDecorationDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error)
        });
      }

      if (req.file) {
        parsedData.data.image = `/uploads/${req.file.filename}`;
      }

      const updated = await decorationService.updateDecoration(
        req.params.id,
        parsedData.data
      );

      return res.status(200).json({
        success: true,
        message: "Decoration updated",
        data: updated
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteDecoration(req: Request, res: Response) {
    try {
      await decorationService.deleteDecoration(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Decoration deleted"
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });
    }
  }
}