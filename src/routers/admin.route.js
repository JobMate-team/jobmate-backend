import express from "express";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";
import { setUserRole } from "../middlewares/role.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import { adminLoginController } from "../controllers/admin.controller.js";
import { getAdminCoachingList, getAdminCoachingDetail } from "../controllers/adminCoaching.controller.js";
import { 
    adminGetReviewList, adminGetReviewDetail,
    adminPatchReview, adminDeleteReviewController
 } from "../controllers/adminReview.controller.js";
import { getAdminQuestions, createAdminQuestion, updateAdminQuestion, deleteAdminQuestion } from "../controllers/adminQuestion.controller.js";

const router = express.Router();


router.post("/login", adminLoginController); // 관리자 로그인
// 코칭 세션(히스토리)
router.get("/coaching", verifyServiceAccessJWT, setUserRole, adminOnly, getAdminCoachingList)
router.get("/coaching/:coachingId", verifyServiceAccessJWT, setUserRole, adminOnly, getAdminCoachingDetail)
// 면접 후기 
router.get("/reviews", verifyServiceAccessJWT, setUserRole, adminOnly, adminGetReviewList)
router.get("/reviews/:reviewId", verifyServiceAccessJWT, setUserRole, adminOnly, adminGetReviewDetail)
router.patch("/reviews/:reviewId", verifyServiceAccessJWT, setUserRole, adminOnly, adminPatchReview);
router.delete("/reviews/:reviewId", verifyServiceAccessJWT, setUserRole, adminOnly, adminDeleteReviewController);
// 질문 템플릿
router.get("/question-templates", verifyServiceAccessJWT, setUserRole, adminOnly, getAdminQuestions);
router.post("/question-templates", verifyServiceAccessJWT, setUserRole, adminOnly, createAdminQuestion);
router.patch("/question-templates/:questionId", verifyServiceAccessJWT, setUserRole, adminOnly, updateAdminQuestion);
router.delete("/question-templates/:questionId", verifyServiceAccessJWT, setUserRole, adminOnly, deleteAdminQuestion);



export default router;
