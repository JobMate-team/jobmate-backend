import { 
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getReviewList
} from "../services/review.service.js";

import { getAuthUserId } from "../utils/auth.js";
import { LoginRequiredError } from "../errors.js";

// 후기 생성
export const createReviewController = async (req, res) => {
  try {
    const user_id = getAuthUserId(req);
    const review = await createReview(user_id, req.body);
    return res.success(review);

  } catch (err) {
    console.error(err);

    if (err instanceof LoginRequiredError) {
      return res.error({
        status: 401,
        errorCode: err.errorCode, // U001
        reason: err.reason,       // "로그인이 필요합니다."
        data: err.data || null,
      });
    }

    return res.error({
      status: 400,
      errorCode: "CREATE_REVIEW_FAILED",
      reason: err.message
    });
  }
};

// 후기 상세 조회
export const getReviewController = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await getReview(reviewId);
    return res.success(review);

  } catch (err) {
    return res.error({
      status: 404,
      errorCode: "REVIEW_NOT_FOUND",
      reason: err.message
    });
  }
};

// 후기 수정
export const updateReviewController = async (req, res) => {
  try {
    const user_id = getAuthUserId(req);
    const reviewId = req.params.reviewId;

    const updated = await updateReview(user_id, reviewId, req.body);
    return res.success(updated);

  } catch (err) {
    console.error(err);

    if (err instanceof LoginRequiredError) {
      return res.error({
        status: 401,
        errorCode: err.errorCode,
        reason: err.reason,
        data: err.data || null,
      });
    }

    return res.error({
      status: 400,
      errorCode: "UPDATE_REVIEW_FAILED",
      reason: err.message
    });
  }
};

// 후기 삭제
export const deleteReviewController = async (req, res) => {
  try {
    const user_id = getAuthUserId(req);
    const reviewId = req.params.reviewId;

    const result = await deleteReview(user_id, reviewId);
    return res.success(result);

  } catch (err) {
    console.error(err);

    if (err instanceof LoginRequiredError) {
      return res.error({
        status: 401,
        errorCode: err.errorCode,
        reason: err.reason,
        data: err.data || null,
      });
    }

    return res.error({
      status: 400,
      errorCode: "DELETE_REVIEW_FAILED",
      reason: err.message
    });
  }
};

export const getReviewListController = async (req, res) => {
  try {
    let userId = null;

    try {
      userId = getAuthUserId(req); // 로그인한 경우만 적용
    } catch (e) {
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
