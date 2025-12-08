import { getAdminStats } from "../repositories/adminStats.repository.js";

export const fetchAdminStats = async () => {
  return await getAdminStats();
};
