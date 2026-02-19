import { Router } from "express";
import * as shareController from "../controllers/share.controller.js";

const router = Router();

// Get shared folder by token (no auth)
router.get("/:token", shareController.getSharedFolder);

export default router;
