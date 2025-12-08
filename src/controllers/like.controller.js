import { toggleReviewLike } from "../services/like.service.js";

export const toggleReviewLikeController = async (req, res) => {
  try {
    if (req.isAdmin) {
      return res.error({
        status: 403,
        errorCode: "ADMIN_CANNOT_LIKE",
        reason: "관리자는 좋아요 기능을 사용할 수 없습니다."
      });
    }
    
    const userId = req.user.id;         
    const reviewId = req.params.reviewId;

    const result = await toggleReviewLike(userId, reviewId);
    return res.success(result);

  } catch (err) {
    console.error(err);
    return res.error({
      status: 400,
      errorCode: "LIKE_TOGGLE_FAILED",
      reason: err.message
    });
  }
}
