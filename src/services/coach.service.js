import axios from "axios";
import { 
    getJobCategoriesRepo,
    getJobRolesRepo,
    getCompanyListRepo,
    getJobCategoryNameRepo,
    getJobRoleNameRepo,
    getCompanyNameRepo,
    findJobCategoryByIdRepo,
    getQuestionsByJobCategoryRepo,
    checkRoleCompanyMapRepo,
    insertFeedbackRepo,
    checkDuplicateRepo
} from "../repositories/coach.repository.js";

export const getJobCategoriesService = async() => {
    return await getJobCategoriesRepo();
};

export const getJobRolesService = async (jobCategoryId) => {
    const jobId = await findJobCategoryByIdRepo(jobCategoryId);
    if (!jobId) {
        throw new Error("존재하지 않는 직군입니다.");
    }

    return await getJobRolesRepo(jobCategoryId);
};

export const getCompanyListService = async () => {
    return await getCompanyListRepo();
};

export const findJobCategoryService = async (jobCategoryId) => {
    return await findJobCategoryByIdRepo(jobCategoryId);
};

export const getQuestionsByJobCategoryService = async(jobCategoryId) => {
    const allQuestions = await getQuestionsByJobCategoryRepo(jobCategoryId); //특정 직군의 모든 질문 가져오기

    const grouped = {}; //타입별 그룹핑
    allQuestions.forEach(q => {
        if (!grouped[q.question_type]) grouped[q.question_type] = [];
        grouped[q.question_type].push(q);
    });

    const result = [];

    Object.keys(grouped).forEach(type => {
        const list = grouped[type];

        list.sort(() => Math.random() - 0.5);

        const picked = list.slice(0, 2); //타입별 랜덤 2개씩 추출
        result.push(...picked);
    });

    return result;
}

export const recommendAIQuestionService = async (modal_input_question) => {
    const AI_SERVER_URL = process.env.AI_SERVER_URL;

    try {
        const response = await axios.post(`${AI_SERVER_URL}/generate-question`, {
        modal_input_question,
        });

        return response.data.question;
    } catch (err) {
        console.error("AI 추천 질문 요청 실패:", err.message);
        throw new Error("AI 서버에서 추천 질문을 생성하지 못했습니다.");
    }
};

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

    const jobCategoryName = await getJobCategoryNameRepo(job_category_id);
    const jobRoleName = await getJobRoleNameRepo(role_id);
    const companyName = await getCompanyNameRepo(company_id);
    
    if (!jobCategoryName || !jobRoleName || !companyName) {
        throw new Error("직군/직무/기업 정보를 찾을 수 없습니다.");
    }

    const aiResponse = await axios.post(`${AI_SERVER_URL}/structured-feedback`, {
        company: companyName,
        job_family: jobCategoryName,
        question,
        answer: user_answer,
        top_k: 3
    });

    const feedback = aiResponse.data;

    
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