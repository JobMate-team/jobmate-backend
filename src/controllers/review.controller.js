import { 
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getReviewList
} from "../services/review.service.js";

import { getAuthUserId } from "../utils/auth.js";

// 후기 생성
export const createReviewController = async (req, res) => {
  try {
    const review = await createReview(req.user_id, req.body);
    return res.success(review);
  } catch (err) {
    console.error(err);
    return res.error({
      status: 400,
      errorCode: "CREATE_REVIEW_FAILED",
      reason: err.message,
    });
  }
};


// 후기 상세 조회
export const getReviewController = async (req, res) => {
  try {
    const review = await getReview(req.params.reviewId);
    return res.success(review);
  } catch (err) {
    return res.error({
      status: 404,
      errorCode: "REVIEW_NOT_FOUND",
      reason: err.message,
    });
  }
};


// 후기 수정
export const updateReviewController = async (req, res) => {
  try {
    const updated = await updateReview(req.user_id, req.params.reviewId, req.body);
    return res.success(updated);
  } catch (err) {
    console.error(err);
    return res.error({
      status: 400,
      errorCode: "UPDATE_REVIEW_FAILED",
      reason: err.message,
    });
  }
};


// 후기 삭제
export const deleteReviewController = async (req, res) => {
  try {
    const result = await deleteReview(req.user_id, req.params.reviewId);
    return res.success(result);
  } catch (err) {
    console.error(err);
    return res.error({
      status: 400,
      errorCode: "DELETE_REVIEW_FAILED",
      reason: err.message,
    });
  }
};


export const getReviewListController = async (req, res) => {
  try {
    let userId = null;

    try {
      userId = getAuthUserId(req); 
    } catch (_) {
      userId = null; 
    }

    const list = await getReviewList(req.query, userId);
    return res.success(list);

  } catch (err) {
    return res.error({
      status: 400,
      errorCode: "REVIEW_LIST_FAILED",
      reason: err.message,
    });
  }
};

