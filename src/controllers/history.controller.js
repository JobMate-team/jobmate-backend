import { createHistory } from "../services/history.service.js";

export const saveMyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { coachingId } = req.body;

    if (!coachingId) {
      return res.error({
        status: 400,
        errorCode: "INVALID_INPUT",
        reason: "coachingId는 필수입니다."
      });
    }

    const historyData = await createHistory(userId, coachingId);

    return res.success({
      message: "히스토리에 성공적으로 저장되었습니다.",
      data: historyData
    });

  } catch (error) {
    console.error("히스토리 저장 오류:", error);

    return res.error({
      status: error.statusCode || 500,
      errorCode: error.errorCode || "SERVER_ERROR",
      reason: error.reason || error.message || "서버 오류",
      data: error.data || null
    });
  }
};