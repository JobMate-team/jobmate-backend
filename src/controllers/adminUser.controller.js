import { fetchAdminUserList, fetchUserDashboardStats } from "../services/adminUser.service.js";

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await fetchAdminUserList(req.query);
    return res.success(users);
  } catch (err) {
    next({
      statusCode: 500,
      errorCode: "FAILED_TO_GET_ADMIN_USERS",
      reason: err.message,
    });
  }
};


export const getUsersDashboard = async (req, res, next) => {
  try {
    const stats = await fetchUserDashboardStats();
    return res.success(stats);
  } catch (err) {
    next({
      statusCode: 500,
      errorCode: "FAILED_TO_GET_DASHBOARD_STATS",
      reason: err.message,
    });
  }
};
