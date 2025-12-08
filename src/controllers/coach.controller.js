import { 
    getJobCategoriesService,
    getJobRolesService, 
    getCompaniesByRoleService,
    getQuestionListService, 
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
        const { categoryId } = req.params;
        const data = await getJobRolesService(categoryId);

        return res.success({ jobRoles: data });
    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "JOB_ROLE_FETCH_FAIL",
            reason: err.message
        });
    }
};

export const getCompaniesByRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const data = await getCompaniesByRoleService(roleId);

        return res.success({ companies: data });
    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "COMPANY_FETCH_FAIL",
            reason: err.message
        });
    }
};

export const getQuestionList = async(req, res) => {
    try{
        const { job_id } = req.query;
        const questionList = await getQuestionListService(job_id);

        return res.success({ questions: questionList });
    } catch (err){
        return res.error({ status: 500, errorCode: "JOB_CATEGORY_FETCH_FAIL", reason: err.message })
    }
}

export const coachFeedback = async (req, res) => {
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

export const saveFeedback = async (req, res) => {
    const userId = req.user.id;

    const {
        job_category_id,
        job_category_name,
        role_id,
        role_name,
        company_id,
        company_name,
        question_id,
        question_text,
        answer_text,
        ai_feedback,
        ai_model_answer,
    } = req.body;

    try {
        const result = await saveFeedbackService({
            userId,
            job_category_id,
            job_category_name,
            role_id,
            role_name,
            company_id,
            company_name,
            question_id,
            question_text,
            answer_text,
            ai_feedback,
            ai_model_answer,
        });

        return res.success(result);
    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "SAVE_FEEDBACK_FAIL",
            reason: err.message,
        });
    }

};