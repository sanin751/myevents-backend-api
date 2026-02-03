import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

let authController = new AuthController();
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.put("/update", authorizedMiddleware, uploads.single("profile"), authController.updateUser);
router.get("/users/:id", authController.getUserById);
export default router;