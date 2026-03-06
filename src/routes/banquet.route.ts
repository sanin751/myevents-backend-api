import { Router } from "express";
import { BanquetController } from "../controllers/banquet.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const banquetController = new BanquetController();

/**
 * Public Routes
 */
router.get("/", banquetController.getAllBanquets);
router.get("/:id", banquetController.getBanquetById);

/**
 * Admin Routes (Protected)
 */
router.post(
  "/",
  
  uploads.single("image"),
  banquetController.createBanquet
);

router.put(
  "/:id",
  
  uploads.single("image"),
  banquetController.updateBanquet
);

router.delete(
  "/:id",
  
  banquetController.deleteBanquet
);

export default router;