import express from "express";
import {
  createReviewController,
  getReviewController,
  updateReviewController,
  deleteReviewController,
  getReviewListController
} from "../controllers/review.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 로그인 필요
router.post("/", authRequired,createReviewController);
router.patch("/:reviewId", authRequired, updateReviewController); 
router.delete("/:reviewId", authRequired, deleteReviewController);
// 로그인 필요 X
router.get("/:reviewId", getReviewController);      
router.get("/", getReviewListController);

export default router;
