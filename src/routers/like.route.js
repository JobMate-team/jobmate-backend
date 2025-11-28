import express from "express";
import { toggleReviewLikeController } from "../controllers/like.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

// 좋아요 기능
router.patch("/:reviewId/like", verifyServiceAccessJWT, authRequired, toggleReviewLikeController);

export default router;
