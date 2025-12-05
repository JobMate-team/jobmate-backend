import {
  createReviewRepo, getReviewRepo,updateReviewRepo, deleteReviewRepo, getReviewListRepo
} from "../repositories/review.repository.js";

export const createReview = async (user_id, body) => {
  const { company_name, job_category_id, content, interview_tip } = body;

  if (!company_name || !job_category_id || !content) {
    throw new Error("필수 항목(company_name, job_category_id, content)이 누락되었습니다.");
  }

  const reviewId = await createReviewRepo({
    user_id, company_name, job_category_id, content, interview_tip
  });

  return await getReviewRepo(reviewId);
};

export const getReview = async (reviewId) => {
  const review = await getReviewRepo(reviewId);
  if (!review) throw new Error("리뷰를 찾을 수 없습니다.");
  return review;
};

export const updateReview = async (user_id, reviewId, body, isAdmin, adminId) => {
  const existing = await getReviewRepo(reviewId);
  if (!existing) throw new Error("리뷰를 찾을 수 없습니다.");
  if (!isAdmin && existing.user_id !== user_id) throw new Error("본인이 작성한 후기만 수정할 수 있습니다.");

  const editedByAdminId = isAdmin ? adminId : null;

  await updateReviewRepo(reviewId, body, editedByAdminId);
  return await getReviewRepo(reviewId);
};

export const deleteReview = async (user_id, reviewId, isAdmin) => {
  const existing = await getReviewRepo(reviewId);
  if (!existing) {
    throw new Error("리뷰를 찾을 수 없습니다.");
  }

  if (!isAdmin && existing.user_id !== user_id) {
    throw new Error("본인이 작성한 후기만 삭제할 수 있습니다.");
  }

  await deleteReviewRepo(reviewId);

  return {
    message: "리뷰가 성공적으로 삭제되었습니다.",
    reviewId,
  };
};


export const getReviewList = async (query, userId) => {
  const job_category_id = query.job_category_id || null;
  const limit = Number(query.limit) || 10;
  const offset = Number(query.offset) || 0;
  const sort = query.sort || "latest";

  return await getReviewListRepo({
    sort, job_category_id, limit, offset, userId
  });
};
