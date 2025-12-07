import express from "express";
import { adminLoginController } from "../controllers/admin.controller.js";
import { getAdminCoachingList } from "../controllers/adminCoaching.controller.js";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";
import { setUserRole } from "../middlewares/role.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import { getAdminCoachingDetail } from "../controllers/adminCoaching.controller.js";

const router = express.Router();

// 관리자 로그인
router.post("/login", adminLoginController);
router.get("/coaching", verifyServiceAccessJWT, setUserRole, adminOnly, getAdminCoachingList)
router.get("/coaching/:coachingId", verifyServiceAccessJWT, setUserRole, adminOnly, getAdminCoachingDetail)

export default router;
