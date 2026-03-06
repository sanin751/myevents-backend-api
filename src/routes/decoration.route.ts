import { Router } from "express";
import { DecorationController } from "../controllers/decoration.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const decorationController = new DecorationController();

// ✅ Create Decoration (Admin Only)
router.post(
  "/",
  authorizedMiddleware,
  uploads.single("image"),
  decorationController.createDecoration
);

// ✅ Get All Decorations (Public)
router.get("/", decorationController.getAllDecorations);

// ✅ Get Decoration By ID (Public)
router.get("/:id", decorationController.getDecorationById);

// ✅ Update Decoration (Admin Only)
router.put(
  "/:id",
  authorizedMiddleware,
  uploads.single("image"),
  decorationController.updateDecoration
);

// ✅ Delete Decoration (Admin Only)
router.delete(
  "/:id",
  authorizedMiddleware,
  decorationController.deleteDecoration
);

export default router;