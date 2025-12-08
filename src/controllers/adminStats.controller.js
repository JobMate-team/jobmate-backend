import { fetchAdminStats } from "../services/adminStats.service.js";

export const getAdminStatsController = async (req, res, next) => {
  try {
    const stats = await fetchAdminStats();
    return res.success(stats);
  } catch (err) {
    next({
      statusCode: 500,
      errorCode: "FAILED_TO_GET_ADMIN_STATS",
      reason: err.message
    });
  }
};
