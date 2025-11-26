import { getAuthUserId } from "../utils/auth.js";
import { LoginRequiredError } from "../errors.js";

export const authRequired = (req, res, next) => {
  try {
    const userId = getAuthUserId(req);
    req.user_id = userId; 
    next();

  } catch (err) {
    if (err instanceof LoginRequiredError) {
      return res.error({
        status: 401,
        errorCode: err.errorCode,
        reason: err.reason,
        data: err.data || null,
      });
    }

    return res.error({
      status: 401,
      errorCode: "INVALID_TOKEN",
      reason: "인증이 필요합니다."
    });
  }
};
