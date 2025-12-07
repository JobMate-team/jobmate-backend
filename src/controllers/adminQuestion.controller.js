import { NotFoundError } from "../errors.js";
import { 
    getQuestionList, getQuestionStats,
    addQuestion, updateQuestion, removeQuestion,
} from "../services/adminQuestion.service.js";
import { getQuestionById } from "../repositories/adminQuestion.repository.js"; 

export const getAdminQuestions = async (req, res, next) => {
  try {
    const { jobCategoryId } = req.query;

    const list = await getQuestionList(jobCategoryId);
    const stats = await getQuestionStats();

    return res.success({
      list,
      stats
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export const createAdminQuestion = async (req, res, next) => {
  try {
    const { content, job_category_id, question_type } = req.body;

    const insertId = await addQuestion({ 
      content, 
      job_category_id, 
      question_type 
    });

    // 방금 생성된 질문 다시 조회해서 프론트로 반환
    const createdQuestion = await getQuestionById(insertId);

    return res.success({
      message: "질문이 성공적으로 추가되었습니다.",
      question: createdQuestion
    });
  } catch (err) {
    next(err);
  }
};

// 질문 템플릿 수정 
export const updateAdminQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { content, job_category_id, question_type } = req.body;

    // 질문 존재 확인
    const existing = await getQuestionById(questionId);
    if (!existing) {
      throw new NotFoundError("해당 질문을 찾을 수 없습니다.");
    }

    const updateFields = {
      content: content ?? existing.content,
      job_category_id: job_category_id ?? existing.job_category_id,
      question_type: question_type ?? existing.question_type
    };

    await updateQuestion(questionId, updateFields);

    // 수정 후 다시 조회
    const updated = await getQuestionById(questionId);

    return res.success({
      message: "질문이 성공적으로 수정되었습니다.",
      question: updated
    });

  } catch (err) {
    next(err);
  }
};


export const deleteAdminQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    // 존재 여부 확인
    const existing = await getQuestionById(questionId);
    if (!existing) {
      throw new NotFoundError("해당 질문을 찾을 수 없습니다.");
    }

    await removeQuestion(questionId);

    return res.success({
      message: "질문이 성공적으로 삭제되었습니다.",
      deleted_id: questionId
    });

  } catch (err) {
    next(err);
  }
};
