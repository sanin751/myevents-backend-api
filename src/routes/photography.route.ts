import { Router } from "express";
import { PhotographyPackageController } from "../controllers/photography.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

let photographyController = new PhotographyPackageController();
const router = Router();

// Create package (Admin only - protected)
router.post(
  "/create",
  authorizedMiddleware,
  uploads.single("image"),
  photographyController.create
);

// Update package (Admin only - protected)
router.put(
  "/update/:id",
  authorizedMiddleware,
  uploads.single("image"),
  photographyController.update
);

// Get all packages (Public)
router.get("/all", photographyController.getAll);

// Get single package by ID (Public)
router.get("/:id", photographyController.getById);

// Delete package (Admin only - protected)
router.delete(
  "/delete/:id",
  authorizedMiddleware,
  photographyController.delete
);

export default router;