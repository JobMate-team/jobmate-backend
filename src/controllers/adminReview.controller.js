import { BadRequestError } from "../errors.js";
import { NotFoundError } from "../errors.js";
import { 
    getAdminReviewList, getAdminReviewDetail ,
    adminUpdateReview, adminDeleteReview
} from "../services/adminReview.service.js";



export const adminGetReviewList = async (req, res, next) => {
  try {
    const { jobCategoryId } = req.query;

    if (jobCategoryId && isNaN(jobCategoryId)) {
      return next(new BadRequestError("jobCategoryId는 숫자여야 합니다."));
    }

    const result = await getAdminReviewList(jobCategoryId);

    return res.success(result);
  } catch (err) {
    next(err);
  }
};


export const adminGetReviewDetail = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const data = await getAdminReviewDetail(reviewId);

    if (!data) {
      return next(new NotFoundError("지정한 면접 후기를 찾을 수 없습니다."));
    }

    return res.success(data);
  } catch (err) {
    next(err);
  }
};


// 수정
export const adminPatchReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const adminId = req.user.id; // 관리자는 JWT에서 가져옴

    const updated = await adminUpdateReview(reviewId, adminId, req.body);

    if (!updated) {
      return next(new NotFoundError("수정하려는 면접 후기를 찾을 수 없습니다."));
    }

    return res.success(updated);
  } catch (err) {
    next(err);
  }
};

export const adminDeleteReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const deleted = await adminDeleteReview(reviewId);

    if (!deleted) {
      return next(new NotFoundError("삭제하려는 면접 후기를 찾을 수 없습니다."));
    }

    return res.success({
      message: "면접 후기가 정상적으로 삭제되었습니다.",
      reviewId,
    });

  } catch (err) {
    next(err);
  }
};