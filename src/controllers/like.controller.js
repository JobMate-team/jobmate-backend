import { toggleReviewLike } from "../services/like.service.js";
import { getAuthUserId } from "../utils/auth.js";

export const toggleReviewLikeController = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
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
};
