import { getAllCoachingSessions } from "../services/adminCoaching.service.js";
import { getCoachingSessionDetail } from "../services/adminCoaching.service.js";
import { NotFoundError } from "../errors.js";

export const getAdminCoachingList = async (req, res, next) => {
  const list = await getAllCoachingSessions();
  return res.success(list);
};

//상세 조회
export const getAdminCoachingDetail = async (req, res, next) => {
  try {
    const { coachingId } = req.params;
    const data = await getCoachingSessionDetail(coachingId);

    if (!data) {
      return next(new NotFoundError("지정한 코칭 기록을 찾을 수 없습니다."));
    }

    return res.success(data);
  } catch (err) {
    next(err);
  }
};

