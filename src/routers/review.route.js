import express from "express";
import {
  createReviewController,
  getReviewController,
  updateReviewController,
  deleteReviewController,
  getReviewListController
} from "../controllers/review.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

// 로그인 필요
router.post("/", verifyServiceAccessJWT, authRequired, createReviewController);
router.patch("/:reviewId", verifyServiceAccessJWT, authRequired, updateReviewController);
router.delete("/:reviewId", verifyServiceAccessJWT, authRequired, deleteReviewController);
// 로그인 필요 X
router.get("/:reviewId", getReviewController);      
router.get("/", getReviewListController);

export default router;
