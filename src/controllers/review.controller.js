import { 
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getReviewList
} from "../services/review.service.js";

// 후기 생성
export const createReviewController = async (req, res) => {
  try {
    const review = await createReview(req.user.id, req.body);
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
    const updated = await updateReview(req.user.id, req.params.reviewId, req.body);
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
    const result = await deleteReview(req.user.id, req.params.reviewId);
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


// 후기 목록 조회 (로그인 여부 optional)
export const getReviewListController = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; 
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
