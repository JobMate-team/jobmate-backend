import express from "express";
import { mockLoginController } from "../controllers/auth-test.controller.js";

const router = express.Router();

router.post("/mock-login", mockLoginController);

export default router;
