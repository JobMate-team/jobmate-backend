import { pool } from "../db.config.js";

// 중복 확인
export const checkHistoryExists = async (userId, coachingId) => {
    const sql = `
        SELECT id
        FROM history
        WHERE user_id = ? AND coaching_id = ?
        LIMIT 1;
    `;

    const [rows] = await pool.query(sql, [userId, coachingId]);
    return rows.length > 0; 
};

// 코칭 세션이 해당 사용자의 것인지 확인
export const checkCoachingSessionOwner = async (coachingId, userId) => {
  const sql = `
    SELECT id 
    FROM coaching_session
    WHERE id = ? AND user_id = ?
    LIMIT 1;
  `;

  const [rows] = await pool.query(sql, [coachingId, userId]);
  return rows.length > 0; 
};

// 히스토리 저장
export const saveHistory = async (userId, coachingId) => {
  const sql = `
      INSERT INTO history (user_id, coaching_id)
      VALUES (?, ?);
  `;

  const [result] = await pool.query(sql, [userId, coachingId]);
  return result.insertId;  
};
