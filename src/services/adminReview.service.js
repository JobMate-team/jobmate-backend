import { 
    findAdminReviewList, findAdminReviewDetail,
    updateReviewByAdmin,   
    deleteReviewLikes, deleteReviewById, 
 } 
 from "../repositories/adminReview.repository.js";


export const getAdminReviewList = async (jobCategoryId) => {
  return await findAdminReviewList(jobCategoryId);
};


export const getAdminReviewDetail = async (reviewId) => {
  return await findAdminReviewDetail(reviewId);
};


// 수정
export const adminUpdateReview = async (reviewId, adminId, updateData) => {
  // 기존 후기 존재하는지 확인
  const existing = await findAdminReviewDetail(reviewId);
  if (!existing) return null;

  await updateReviewByAdmin(reviewId, adminId, updateData);
  
  // 업데이트 후 다시 조회해서 반환
  return await findAdminReviewDetail(reviewId);
};

export const adminDeleteReview = async (reviewId) => {
  // 존재하는지 확인
  const exists = await findAdminReviewDetail(reviewId);
  if (!exists) return null;

  // 좋아요 먼저 삭제
  await deleteReviewLikes(reviewId);

  // 리뷰 삭제
  const deleted = await deleteReviewById(reviewId);
  return deleted > 0;
};