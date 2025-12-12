import {
  createReviewRepo,
  getReviewRepo,
  updateReviewRepo,
  deleteReviewRepo,
  getReviewListRepo
} from "../repositories/review.repository.js";
import { removeAllLikesByReviewRepo } from "../repositories/like.repository.js";

// 후기 생성
export const createReview = async (userId, body) => {
  const { company_name, job_category_id, content, interview_tip } = body;

  if (!company_name || !job_category_id || !content) {
    throw new Error("필수 항목(company_name, job_category_id, content)이 누락되었습니다.");
  }

  const reviewId = await createReviewRepo({
    user_id: userId,
    company_name,
    job_category_id,
    content,
    interview_tip
  });

  // userId 전달
  return await getReviewRepo(reviewId, userId);
};

// 후기 상세 조회
export const getReview = async (reviewId, userId = null) => {
  const review = await getReviewRepo(reviewId, userId);
  if (!review) throw new Error("리뷰를 찾을 수 없습니다.");
  return review;
};

// 후기 수정
export const updateReview = async (userId, reviewId, body, isAdmin, adminId) => {
  const existing = await getReviewRepo(reviewId, userId);
  if (!existing) throw new Error("리뷰를 찾을 수 없습니다.");

  if (!isAdmin && existing.user_id !== userId) {
    throw new Error("본인이 작성한 후기만 수정할 수 있습니다.");
  }

  const editedByAdminId = isAdmin ? adminId : null;

  await updateReviewRepo(reviewId, body, editedByAdminId);

  // userId 전달
  return await getReviewRepo(reviewId, userId);
};

// 후기 삭제
export const deleteReview = async (userId, reviewId, isAdmin) => {
  const existing = await getReviewRepo(reviewId, userId);
  if (!existing) throw new Error("리뷰를 찾을 수 없습니다.");

  if (!isAdmin && existing.user_id !== userId) {
    throw new Error("본인이 작성한 후기만 삭제할 수 있습니다.");
  }

  // 1. 좋아요 먼저 전체 삭제 (FK 해결)
  await removeAllLikesByReviewRepo(reviewId);

  // 2. 리뷰 삭제
  await deleteReviewRepo(reviewId);

  return {
    message: "리뷰가 성공적으로 삭제되었습니다.",
    reviewId,
  };
};

// 후기 목록 조회
export const getReviewList = async (query, userId = null) => {
  const job_category_id = query.job_category_id || null;
  const limit = Number(query.limit) || 10;
  const offset = Number(query.offset) || 0;
  const sort = query.sort || "latest";

  return await getReviewListRepo({
    sort,
    job_category_id,
    limit,
    offset,
    userId
  });
};
