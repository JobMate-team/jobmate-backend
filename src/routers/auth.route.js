import express from "express";
import { 
    kakaoLoginRedirect,
    kakaoCallback,
    updateJobCategory,
    refreshRotation,
    logoutInvalidate
} from "../controllers/auth.controller.js";
import { verifyServiceAccessJWT, verifyRefreshJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.get("/kakao/login", kakaoLoginRedirect);
router.get("/kakao/callback", kakaoCallback);

router.patch("/me/job-category", verifyServiceAccessJWT, updateJobCategory);

router.post("/refresh", verifyRefreshJWT, refreshRotation); //Client의 refreshtoken 비교해 access, refresh토큰 교체
router.post("/logout", verifyServiceAccessJWT ,logoutInvalidate);

export default router;