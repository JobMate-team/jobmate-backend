import express from "express";
import { kakaoLoginRedirect, kakaoCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/kakao/login", kakaoLoginRedirect);
router.get("/kakao/callback", kakaoCallback); //카카오->백엔드로 받아서 작성함(프론트 없어서)
//router.post("/kakao/callback", kakaoCallback); //프론트 있을 때 사용

export default router;