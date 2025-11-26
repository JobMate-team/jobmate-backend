import {
  getLikeByUserRepo,
  addLikeRepo,
  removeLikeRepo,
  updateReviewLikeCountRepo
} from "../repositories/like.repository.js";
import { getReviewRepo } from "../repositories/review.repository.js";

export const toggleReviewLike = async (userId, reviewId) => {
  // 리뷰 존재 여부 체크
  const review = await getReviewRepo(reviewId);
  if (!review) throw new Error("존재하지 않는 리뷰입니다.");

  // 좋아요 여부 체크
  const existing = await getLikeByUserRepo(reviewId, userId);

  // 좋아요 취소
  if (existing) {
    await removeLikeRepo(reviewId, userId);
    await updateReviewLikeCountRepo(reviewId, -1);

    return { reviewId, liked: false };
  }

  // 좋아요 추가
  await addLikeRepo(reviewId, userId);
  await updateReviewLikeCountRepo(reviewId, +1);

  return { reviewId,liked: true };
};
