import express from "express";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";
import { getUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile", verifyServiceAccessJWT, getUserProfile);

export default router;