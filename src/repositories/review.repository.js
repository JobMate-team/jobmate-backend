import { pool } from "../db.config.js";

export const createReviewRepo = async (data) => {
  const sql = `
    INSERT INTO review (user_id, company_name, job_category_id, content, interview_tip, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())`;

  const [result] = await pool.query(sql, [
    data.user_id,
    data.company_name,
    data.job_category_id,
    data.content,
    data.interview_tip || null,
  ]);

  return result.insertId;
};

export const getReviewRepo = async (id, userId = null) => {
  const sql = `
    SELECT 
      r.*,
      u.nickname,
      j.name AS job_category_name,
      EXISTS (
        SELECT 1 FROM review_likes 
        WHERE review_id = r.id AND user_id = ?
      ) AS liked
    FROM review r
    JOIN user u ON r.user_id = u.id
    JOIN job_category j ON r.job_category_id = j.id
    WHERE r.id = ?
  `;

  const [rows] = await pool.query(sql, [userId || 0, id]); 
  return rows[0];
};

export const updateReviewRepo = async (id, data) => {
  const sql = `
    UPDATE review
    SET 
      company_name = ?,
      job_category_id = ?,
      content = ?,
      interview_tip = ?
    WHERE id = ?
  `;

  await pool.query(sql, [
    data.company_name,
    data.job_category_id,
    data.content,
    data.interview_tip || null,
    id
  ]);
};

export const deleteReviewRepo = async (reviewId) => {
  const sql = `DELETE FROM review WHERE id = ?`;
  await pool.query(sql, [reviewId]);
};

export const getReviewListRepo = async ({ sort, job_category_id, limit, offset, userId }) => {

  let where = "";
  const params = [];

  if (job_category_id) {
    where = "WHERE r.job_category_id = ?";
    params.push(job_category_id);
  }

  let orderBy = "ORDER BY r.created_at DESC";
  if (sort === "popular") {
    orderBy = "ORDER BY r.likes DESC, r.created_at DESC";
  }

  const sql = `
    SELECT
      r.id, r.company_name, r.content, r.interview_tip, r.job_category_id,
      r.likes, r.created_at, u.nickname, j.name AS job_category_name,
      EXISTS (
        SELECT 1 FROM review_likes rl
        WHERE rl.review_id = r.id AND rl.user_id = ?
      ) AS liked
    FROM review r
    JOIN user u ON r.user_id = u.id
    JOIN job_category j ON r.job_category_id = j.id
    ${where}
    ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(sql, [userId || 0, ...params, limit, offset]);
  return rows;
};
