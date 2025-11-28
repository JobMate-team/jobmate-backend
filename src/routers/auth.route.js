import express from "express";
import { kakaoLoginRedirect, kakaoCallback, refreshRotation, logoutInvalidate } from "../controllers/auth.controller.js";
import { verifyServiceAccessJWT, verifyRefreshJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.get("/kakao/login", kakaoLoginRedirect);
router.get("/kakao/callback", kakaoCallback); //카카오->백엔드로 받아서 작성함(프론트 없어서)
//router.post("/kakao/callback", kakaoCallback); //프론트 있을 때 사용

router.post("/refresh", verifyRefreshJWT, refreshRotation); //Client의 refreshtoken 비교해 access, refresh토큰 교체
router.post("/logout", verifyServiceAccessJWT ,logoutInvalidate);

export default router;