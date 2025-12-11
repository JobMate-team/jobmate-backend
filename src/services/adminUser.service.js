import { getAdminUserList, getUserDashboardStats } from "../repositories/adminUser.repository.js";

export const fetchAdminUserList = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;

  return await getAdminUserList({
    search: query.search || null,
    jobCategory: query.jobCategory || null,
    page,
    limit,
  });
};

export const fetchUserDashboardStats = async () => {
  return await getUserDashboardStats();
};