import express from "express";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";
import { 
    getJobCategories,
    getJobRoles,
    getCompanyList,
    getQuestionsByJobCategory,
    recommendAIQuestion,
    createAndSaveFeedback
} from "../controllers/coach.controller.js";

const router = express.Router();

router.get("/job-category", getJobCategories);
router.get("/job-roles", getJobRoles);
router.get("/companies", getCompanyList);

router.get("/questions", getQuestionsByJobCategory);

router.post("/recommend-question", recommendAIQuestion);

router.post("/feedback/save", verifyServiceAccessJWT, createAndSaveFeedback);

export default router;