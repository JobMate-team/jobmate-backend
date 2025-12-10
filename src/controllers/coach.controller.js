import { 
    getJobCategoriesService,
    getJobRolesService, 
    getCompanyListService,
    findJobCategoryService,
    getQuestionsByJobCategoryService,
    recommendAIQuestionService,
    coachFeedbackService,
    saveFeedbackService
} from "../services/coach.service.js";
import { resolveQuestionText } from "../utils/questionSourceResolver.js";

export const getJobCategories = async(req, res) => {
    try{
        const data = await getJobCategoriesService();

        return res.success({ jobCategories: data });
    } catch (err){
        return res.error({ status: 500, errorCode: "JOB_CATEGORY_FETCH_FAIL", reason: err.message })
    }
}

export const getJobRoles = async (req, res) => {
    try {
        const { jobCategoryId } = req.query;

        if (!jobCategoryId) {
            return res.error({
                status: 400,
                errorCode: "jobcategoryId_REQUIRED",
                reason: "jobcategoryId 쿼리 파라미터가 필요합니다."
            });
        }

        const roles = await getJobRolesService(jobCategoryId);

        return res.success({
            jobCategoryId,
            roles
        });
    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "JOB_ROLE_FETCH_FAIL",
            reason: err.message
        });
    }
};

export const getCompanyList = async (req, res) => {
    try {
        const companies = await getCompanyListService();

        return res.success({
            count: companies.length,
            companies
        });
    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "COMPANY_LIST_FETCH_FAIL",
            reason: err.message
        });
    }
};

export const getQuestionsByJobCategory = async (req, res) => {
    try {
        const { jobCategoryId } = req.query;

        if (!jobCategoryId) {
            return res.error({
                status: 400,
                errorCode: "jobCategoryId_REQUIRED",
                reason: "jobCategoryId 쿼리 파라미터가 필요합니다."
            });
        }

        const jobExists = await findJobCategoryService(jobCategoryId);

        if (!jobExists) {
            return res.error({
                status: 400,
                errorCode: "INVALID_JOB_CATEGORY",
                reason: "존재하지 않는 직무입니다."
            });
        }

        const questions = await getQuestionsByJobCategoryService(jobCategoryId);

        return res.success({
            jobCategoryId,
            count: questions.length,
            questions
        });

    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "QUESTION_FETCH_FAILED",
            reason: err.message,
        });
    }
};

export const recommendAIQuestion = async (req, res) => {
    try {
        const { modal_input_question } = req.body;

        if (!modal_input_question) {
        return res.error({
            status: 400,
            errorCode: "MODAL_QUESTION_REQUIRED",
            reason: "추천 질문 생성을 위해 MODAL_QUESTION이 필요합니다."
        });
        }

        const question = await recommendAIQuestionService(modal_input_question);
        return res.success({ question });
    } catch (err) {
        return res.error({
        status: 500,
        errorCode: "AI_RECOMMEND_QUESTION_FAIL",
        reason: err.message,
        });
    }
};

export const createAndSaveFeedback = async (req, res) => {
    const userId = req.user.id; //JWT 미들웨어에서 검증된 사용자 ID
    const { 
        job_category_id,
        role_id,
        company_id,
        question_id,
        question,
        user_answer,
        question_source
    } = req.body;

    try {
        const questionText = await resolveQuestionText({ 
            question_id,
            question,
            question_source
        }); //template or 직접 입력 질문인지 구분

        const result = await coachFeedbackService({
            userId,
            job_category_id,
            role_id,
            company_id,
            question_id, //일단 추가해놓기
            question: questionText,
            user_answer
        });

        

        return res.success(result);
    } catch (err) {
        return res.error({ status: 500, errorCode: "COACH_FAIL", reason: err.message });
    }
};