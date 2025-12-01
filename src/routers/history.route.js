import express from "express";
import { saveMyHistory } from "../controllers/history.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/", verifyServiceAccessJWT, authRequired, saveMyHistory);

export default router;
