import express from "express";
import { adminLoginController } from "../controllers/admin.controller.js";

const router = express.Router();

// 관리자 로그인
router.post("/login", adminLoginController);

export default router;
