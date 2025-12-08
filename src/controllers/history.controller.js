import {
  createHistory,
  fetchUserHistoryList, fetchHistoryDetail,
  removeHistory, removeAllHistory
} from "../services/history.service.js";
import { BadRequestError } from "../errors.js";

// 히스토리 저장
export const saveMyHistory = async (req, res, next) => {
  const userId = req.user.id;
  const { coachingId } = req.body;

  if (!coachingId) {
    throw new BadRequestError("coachingId는 필수입니다.");
  }

  const historyData = await createHistory(userId, coachingId);

  return res.success({
    message: "히스토리에 성공적으로 저장되었습니다.",
    data: historyData,
  });
};

// 히스토리 목록 조회
export const getMyHistoryList = async (req, res, next) => {
  const userId = req.user.id;
  const list = await fetchUserHistoryList(userId);

  return res.success({
    message:
      list.length === 0
        ? "저장된 히스토리가 없습니다."
        : "히스토리 목록 조회 성공",
    data: list,
  });
};

// 히스토리 상세 조회
export const getMyHistoryDetail = async (req, res, next) => {
  const userId = req.user.id;
  const historyId = req.params.id;

  const detail = await fetchHistoryDetail(userId, historyId);

  return res.success({
    message: "히스토리 상세 조회 성공",
    data: detail,
  });
};

// 히스토리 개별 삭제
export const deleteMyHistory = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await removeHistory(userId, id);

  return res.success({
    message: "히스토리가 성공적으로 삭제되었습니다.",
    data: result,
  });
};

// 히스토리 전체 삭제
export const deleteAllMyHistory = async (req, res, next) => {
  const userId = req.user.id;

  const result = await removeAllHistory(userId);

  return res.success({
    message: "히스토리를 모두 삭제했습니다.",
    data: result,
  });
};
