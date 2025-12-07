import { pool } from "../db.config.js";

export const findAllCoachingSessions = async () => {
  const query = `
    SELECT 
      cs.id,
      cs.created_at,
      u.nickname AS user_name,
      jc.name AS job_category_name,
      q.content AS question_title
    FROM coaching_session cs
    LEFT JOIN user u ON cs.user_id = u.id
    LEFT JOIN job_category jc ON cs.job_category_id = jc.id
    LEFT JOIN question q ON cs.question_id = q.id
    ORDER BY cs.created_at DESC
  `;

  const [rows] = await pool.execute(query);
  return rows;
};

// 상세 조회
export const findCoachingSessionById = async (coachingId) => {
  const query = `
    SELECT 
      cs.id,
      cs.created_at,
      cs.answer_text,
      cs.ai_feedback,
      cs.ai_model_answer,       
      cs.job_category_id,          
      u.nickname AS user_name,
      u.email AS user_email,       
      jc.name AS job_category_name,
      q.content AS question_title
    FROM coaching_session cs
    LEFT JOIN user u ON cs.user_id = u.id
    LEFT JOIN job_category jc ON cs.job_category_id = jc.id
    LEFT JOIN question q ON cs.question_id = q.id
    WHERE cs.id = ?
  `;

  const [rows] = await pool.execute(query, [coachingId]);
  return rows[0];
};

