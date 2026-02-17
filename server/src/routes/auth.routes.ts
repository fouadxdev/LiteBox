import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.checkAuth);

export default router
