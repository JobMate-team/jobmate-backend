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
  const existing = await findAdminReviewDetail(reviewId);
  if (!existing) return null;

  const updateFields = {
    company_name: updateData.company_name ?? existing.company_name,
    job_category_id: updateData.job_category_id ?? existing.job_category_id,
    content: updateData.content ?? existing.content,
    interview_tip: updateData.interview_tip ?? existing.interview_tip,
    edited_by_admin_id: adminId
  };

  await updateReviewByAdmin(reviewId, updateFields);

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