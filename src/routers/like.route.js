import express from "express";
import { toggleReviewLikeController } from "../controllers/like.controller.js";

const router = express.Router();

// 좋아요 기능
router.patch("/:reviewId/like", toggleReviewLikeController);

export default router;
