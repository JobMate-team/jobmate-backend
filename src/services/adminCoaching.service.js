import { findAllCoachingSessions } from "../repositories/adminCoaching.repository.js";
import { findCoachingSessionById } from "../repositories/adminCoaching.repository.js";


export const getAllCoachingSessions = async () => {
  return await findAllCoachingSessions();
};

export const getCoachingSessionDetail = async (coachingId) => {
  return await findCoachingSessionById(coachingId);
};
