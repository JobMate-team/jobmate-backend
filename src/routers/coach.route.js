import express from "express";
import { 
    getJobCategories,
    getJobRoles,
    getCompanyList,
    getQuestionsByJobCategory,
    recommendAIQuestions,
    createAndSaveFeedback
} from "../controllers/coach.controller.js";

const router = express.Router();

router.get("/job-category", getJobCategories);
router.get("/job-roles", getJobRoles);
router.get("/companies", getCompanyList);

router.get("/questions", getQuestionsByJobCategory);

router.post("/recommend-questions", recommendAIQuestions);

router.post("/feedback/save", createAndSaveFeedback);

export default router;