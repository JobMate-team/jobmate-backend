import { getQuestionById } from "../repositories/coach.repository.js";

export const resolveQuestionText = async ({ question_id, question, question_source }) => {
    if (question_id && question) {
        throw new Error("question_id와 question은 동시에 보낼 수 없습니다.");
    }

    if (!question_source) {
        throw new Error("question_source는 'template' 또는 'input'이어야 합니다.");
    }

    if (question_source === "template") {
        if (!question_id) throw new Error("DB 선택 질문에는 question_id가 필요합니다.");
        const q = await getQuestionById(question_id);
        if (!q) throw new Error("DB에서 면접 질문을 찾을 수 없습니다.");
        return q.text;
    }
    
    if (question_source === "input") {
        const input = (question || "").trim();
        if (input.length < 3) throw new Error("직접 입력 질문은 3자 이상이어야 합니다.");
        return input;
    }

    throw new Error("허용되지 않은 question_source 값입니다.");
};