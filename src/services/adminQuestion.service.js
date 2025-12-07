import { 
  findQuestions, findQuestionStats, countAllQuestions,
  createQuestion, editQuestion, deleteQuestionById
} from "../repositories/adminQuestion.repository.js";
import { BadRequestError } from "../errors.js";

export const getQuestionList = async (jobCategoryId) => {
  return await findQuestions(jobCategoryId);
};

export const getQuestionStats = async () => {
  const stats = await findQuestionStats();
  const total = await countAllQuestions();

  return {
    total,
    categories: stats
  };
};

export const addQuestion = async ({ content, job_category_id, question_type }) => {

  if (!content || !job_category_id) {
    throw new BadRequestError("질문 내용과 직무는 필수입니다.");
  }

  return await createQuestion({
    content,
    job_category_id,
    question_type
  });
};


export const updateQuestion = async (id, { content, job_category_id, question_type }) => {

  if (!content || !job_category_id) {
    throw new BadRequestError("질문 내용과 직무는 필수입니다.");
  }

  return await editQuestion(id, {
    content,
    job_category_id,
    question_type
  });
};

export const removeQuestion = async (id) => {
  return await deleteQuestionById(id);
};
