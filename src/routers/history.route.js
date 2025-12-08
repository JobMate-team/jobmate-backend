import express from "express";
import { 
    saveMyHistory, getMyHistoryList, getMyHistoryDetail,
    deleteMyHistory, deleteAllMyHistory
 } from "../controllers/history.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

// 히스토리에 저장
router.post("/", verifyServiceAccessJWT, authRequired, saveMyHistory);

// 최신순 히스토리 목록 조회
router.get("/", verifyServiceAccessJWT, authRequired, getMyHistoryList);

// 히스토리 상세 조회
router.get("/:id", verifyServiceAccessJWT, authRequired, getMyHistoryDetail);

// 히스토리 전체 삭제
router.delete("/all", verifyServiceAccessJWT, authRequired, deleteAllMyHistory);

// 히스토리 개별 삭제
router.delete("/:id", verifyServiceAccessJWT, authRequired, deleteMyHistory);

export default router;




