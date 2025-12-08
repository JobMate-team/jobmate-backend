import axios from "axios";
import { 
    getJobCategoriesRepo,
    getJobRolesByCategoryRepo,
    getCompaniesByRoleRepo,
    getJobCategoryNameRepo,
    getJobRoleNameRepo,
    getCompanyNameRepo,
    getQuestionListRepo,
    checkRoleCompanyMapRepo,
    insertFeedbackRepo,
    checkDuplicateRepo
} from "../repositories/coach.repository.js";

export const getJobCategoriesService = async() => {
    return await getJobCategoriesRepo();
};

export const getJobRolesService = async (categoryId) => {
    if (!categoryId) throw new Error("categoryId가 필요합니다.");

    return await getJobRolesByCategoryRepo(categoryId);
};

export const getCompaniesByRoleService = async (roleId) => {
    if (!roleId) throw new Error("roleId가 필요합니다.");

    return await getCompaniesByRoleRepo(roleId);
};

export const getQuestionListService = async(job_id) => {
    return await getQuestionListRepo(job_id);
}

export const coachFeedbackService = async({ 
    userId,
    job_category_id,
    role_id,
    company_id,
    question_id,
    question,
    user_answer,
}) => {
    if (!job_category_id || !role_id || !company_id || !question || !user_answer) {
        throw new Error("필수 입력이 없습니다.");
    }

    const isValidCombo = await checkRoleCompanyMapRepo(role_id, company_id);
    if (!isValidCombo) {
        throw new Error("선택한 직무와 회사 조합이 유효하지 않습니다.");
    }

    const jobGroup = await getJobCategoryNameRepo(job_category_id);
    const jobRole = await getJobRoleNameRepo(role_id);
    const company = await getCompanyNameRepo(company_id);
    
    if (!jobGroup || !jobRole || !company) {
        throw new Error("직무/세부 직무/회사 정보를 찾을 수 없습니다.");
    }

    const aiResponse = await axios.post("http://127.0.0.1:8001/ai-feedback", {
        job_group: jobGroup,
        job: jobRole,
        company: company,
        question,
        answer: user_answer,
    });

    const feedback = aiResponse.data;

    return {
        user_id: userId,
        job_category: {
            id: job_category_id,
            name: jobGroup,
        },
        role: {
            id: role_id,
            name: jobRole,
        },
        company: {
            id: company_id,
            name: company,
        },
        question: {
            id: question_id,
            text: question,
        },
        user_answer,

        ai_feedback: {
            summary: feedback.summary,
            logic: feedback.logic,
            concreteness: feedback.concreteness,
            fit: feedback.fit,
            delivery: feedback.delivery,
            next_tips: feedback.next_tips,
        },

        best_answer: feedback.example_answer,
        sources: feedback.retrieved_sources,
    };
};

export const saveFeedbackService = async (data) => {

    const {
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
    } = data;

    if (!userId || !job_category_id || !question_text || !answer_text) {
        throw new Error("필수 값이 누락되었습니다.");
    }

    const duplicated = await checkDuplicateRepo({
        userId,
        job_category_id,
        role_id,
        company_id,
        question_id,
        answer_text
    });

    if (duplicated) {
        throw new Error("이미 저장된 피드백입니다.");
    }

    const sessionId = await insertFeedbackRepo({
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
        ai_feedback: JSON.stringify(ai_feedback),
        ai_model_answer,
    });

    return {
        session_id: sessionId,
        message: "피드백 저장 완료"
    };
};