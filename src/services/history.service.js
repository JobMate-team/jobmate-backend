import { 
    checkHistoryExists, saveHistory, checkCoachingSessionOwner,
    getUserHistoryList, getHistoryDetail
} from "../repositories/history.repository.js";
import { BadRequestError, ForbiddenError,NotFoundError } from "../errors.js";

export const createHistory = async (userId, coachingId) => {

  // 내 코칭 세션인지 확인
  const isOwner = await checkCoachingSessionOwner(coachingId, userId);
  if (!isOwner) {
    throw new ForbiddenError("본인의 코칭 세션만 히스토리에 저장할 수 있습니다.", {
      coachingId
    });
  }

  // 중복 체크
  const exists = await checkHistoryExists(userId, coachingId);
  if (exists) {
    throw new BadRequestError("이미 저장된 코칭 세션입니다.", {
      coachingId
    });
  }

  // 저장
  const historyId = await saveHistory(userId, coachingId);

  return {
    user_id: userId,
    coaching_id: coachingId,
    history_id: historyId
  };
};

export const fetchUserHistoryList = async (userId) => {
  return await getUserHistoryList(userId);
};

export const fetchHistoryDetail = async (userId, historyId) => {
  const detail = await getHistoryDetail(userId, historyId);

  if (!detail) {
    throw new NotFoundError("해당 히스토리를 찾을 수 없습니다.", { historyId });
  }

  return detail;
};