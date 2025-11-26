import express from "express";
import {
  createReviewController,
  getReviewController,
  updateReviewController,
  deleteReviewController,
  getReviewListController
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReviewController);
router.get("/:reviewId", getReviewController);      
router.patch("/:reviewId", updateReviewController); 
router.delete("/:reviewId", deleteReviewController);
router.get("/", getReviewListController);

export default router;
