import express from "express";
import { getMyProfile, updateMyNickname } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", getMyProfile);
router.patch("/profile", updateMyNickname);

export default router;