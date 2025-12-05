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

      -- 좋아요 여부
      EXISTS (
        SELECT 1 FROM review_likes 
        WHERE review_id = r.id AND user_id = ?
      ) AS liked,

      -- 관리자 수정 여부 (0 = 사용자 수정, 1 = 관리자 수정)
      CASE 
        WHEN r.edited_by_admin_id IS NOT NULL THEN 1
        ELSE 0
      END AS edited_by_admin,

      -- 관리자 이름(관리자가 수정한 경우)
      a.name AS edited_admin_name

    FROM review r
    JOIN user u ON r.user_id = u.id
    JOIN job_category j ON r.job_category_id = j.id

    -- 관리자 테이블 LEFT JOIN (수정 안 했을 수 있으므로 LEFT JOIN)
    LEFT JOIN admin a ON r.edited_by_admin_id = a.id

    WHERE r.id = ?
  `;

  const [rows] = await pool.query(sql, [userId || 0, id]);
  return rows[0];
};


export const updateReviewRepo = async (id, data, editedByAdminId = null) => {
  const sql = `
    UPDATE review
    SET 
      company_name = ?,
      job_category_id = ?,
      content = ?,
      interview_tip = ?,
      edited_by_admin_id = ?,
      updated_at = NOW()
    WHERE id = ?
  `;

  await pool.query(sql, [
    data.company_name,
    data.job_category_id,
    data.content,
    data.interview_tip || null,
    editedByAdminId,
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
