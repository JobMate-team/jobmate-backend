import { pool } from "../db.config.js";

// 중복 확인
export const checkHistoryExists = async (userId, coachingId) => {
    const sql = `SELECT id FROM history WHERE user_id = ? AND coaching_id = ? LIMIT 1;`;

    const [rows] = await pool.query(sql, [userId, coachingId]);
    return rows.length > 0; 
};

// 코칭 세션이 해당 사용자의 것인지 확인
export const checkCoachingSessionOwner = async (coachingId, userId) => {
  const sql = `SELECT id FROM coaching_session WHERE id = ? AND user_id = ? LIMIT 1;`;

  const [rows] = await pool.query(sql, [coachingId, userId]);
  return rows.length > 0; 
};

// 히스토리 저장
export const saveHistory = async (userId, coachingId) => {
  const sql = `INSERT INTO history (user_id, coaching_id) VALUES (?, ?);`;

  const [result] = await pool.query(sql, [userId, coachingId]);
  return result.insertId;  
};

// 최신순 히스토리 목록 조회
export const getUserHistoryList = async (userId) => {
  const sql = `
    SELECT
      h.id AS history_id,
      h.coaching_id,
      h.created_at,
      cs.job_category_id,
      COALESCE(q.content, cs.question_text) AS question_content,
      cs.answer_text,
      cs.ai_feedback
    FROM history h
    JOIN coaching_session cs ON h.coaching_id = cs.id
    LEFT JOIN question q ON cs.question_id = q.id
    WHERE h.user_id = ?
    ORDER BY h.created_at DESC;
  `;

  const [rows] = await pool.query(sql, [userId]);
  return rows;
};

// 히스토리 상세 조회
export const getHistoryDetail = async (userId, historyId) => {
  const sql = `
    SELECT
      h.id AS history_id,
      h.coaching_id,
      h.created_at,
      cs.job_category_id,
      cs.question_id,
      COALESCE(q.content, cs.question_text) AS question_content,
      cs.answer_text,
      cs.ai_feedback,
      cs.ai_model_answer
    FROM history h
    JOIN coaching_session cs ON h.coaching_id = cs.id
    LEFT JOIN question q ON cs.question_id = q.id
    WHERE h.user_id = ? AND h.id = ?
    LIMIT 1;
  `;

  const [rows] = await pool.query(sql, [userId, historyId]);
  return rows[0];
};


// 히스토리 단건 존재 여부 확인
export const checkHistoryIdExists = async (historyId) => {
  const sql = `SELECT id FROM history WHERE id = ? LIMIT 1;`;
  const [rows] = await pool.query(sql, [historyId]);
  return rows.length > 0;
};

// 히스토리 소유자 확인
export const checkHistoryOwner = async (historyId, userId) => {
  const sql = `SELECT id FROM history WHERE id = ? AND user_id = ? LIMIT 1;`;
  const [rows] = await pool.query(sql, [historyId, userId]);
  return rows.length > 0;
};

// 히스토리 삭제
export const deleteHistoryById = async (historyId) => {
  const sql = ` DELETE FROM history WHERE id = ?;`;

  const [result] = await pool.query(sql, [historyId]);
  return result.affectedRows > 0;  // true면 삭제 성공
};

// 전체 히스토리 삭제 (특정 사용자)
export const deleteAllHistoryByUserId = async (userId) => {
  const sql = `DELETE FROM history WHERE user_id = ?;`;

  const [result] = await pool.query(sql, [userId]);
  return result.affectedRows; // 삭제된 row 수
};
