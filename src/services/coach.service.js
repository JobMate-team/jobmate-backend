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
    insertCoachingSessionRepo,
} from "../repositories/coach.repository.js";

import dotenv from "dotenv";
dotenv.config();

const AI_SERVER_URL = process.env.AI_SERVER_URL;

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

export const recommendAIQuestionsService = async({ job_family, job, company }) => {
    try {
        const aiResponse = await axios.post(`${AI_SERVER_URL}/interview/generate`, {
            job_family,
            job,
            company
        });

        const questions = aiResponse.data?.questions || [];

        return questions;

    } catch (err) {
        console.error("AI Interview Error:", err.message);
        throw new Error("AI 서버 인터뷰 질문 생성 실패");
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

    const feedback = aiResponse.data?.markdown; //ai파트가 현재 markdown으로 감싸서 보내는 중
    if (!feedback) {
        throw new Error("AI 응답이 올바르지 않습니다.");
    }

    const sessionId = await insertCoachingSessionRepo({
        userId,
        job_category_id,
        job_category_name: jobCategoryName,
        role_id,
        role_name: jobRoleName,
        company_id,
        company_name: companyName,
        question_id,
        question_text: question,
        answer_text: user_answer,

        ai_feedback: JSON.stringify({
            요약된_인재상: feedback.요약된_인재상,
            기업_맞춤_조언: feedback.기업_맞춤_조언,
            전체_총평: feedback.전체_총평,
            개선포인트: feedback.개선포인트
        }),

        ai_model_answer: feedback.모범_답변_예시
    });
    
    return {
        session_id: sessionId,
        user_answer,
        question,
        company: companyName,
        job_family: jobCategoryName,
        role: jobRoleName,
        ai_feedback: feedback,
        message: "AI 피드백 생성 및 저장 완료"
    };
};