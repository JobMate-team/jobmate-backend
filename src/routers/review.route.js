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
import { setUserRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// 로그인 필요
router.post("/", verifyServiceAccessJWT, authRequired, setUserRole, createReviewController);
router.patch("/:reviewId", verifyServiceAccessJWT, authRequired, setUserRole, updateReviewController);
router.delete("/:reviewId", verifyServiceAccessJWT, authRequired, setUserRole, deleteReviewController);
// 로그인 필요 X
router.get("/:reviewId", getReviewController);      
router.get("/", getReviewListController);

export default router;
