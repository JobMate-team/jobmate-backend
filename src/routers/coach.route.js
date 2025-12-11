import express from "express";
import { verifyServiceAccessJWT } from "../middlewares/jwt.middleware.js";
import { 
    getJobCategories,
    getJobRoles, 
    getCompaniesByRole, 
    getQuestionList,
    recommendAIQuestion,
    coachFeedback,
    saveFeedback,
} from "../controllers/coach.controller.js";

const router = express.Router();

router.get("/job-categories", getJobCategories);
router.get("/job-categories/:categoryId/roles", getJobRoles);
router.get("/roles/:roleId/companies", getCompaniesByRole);

router.get("/questions", getQuestionList);

router.post("/recommend-question", recommendAIQuestion);

router.post("/feedback", verifyServiceAccessJWT, coachFeedback);
router.post("/feedback/save", verifyServiceAccessJWT, saveFeedback);

export default router;