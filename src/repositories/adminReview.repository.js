import { pool } from "../db.config.js";

export const findAdminReviewList = async (jobCategoryId = null) => {
  const baseQuery = `
    SELECT 
      r.id,
      r.company_name,
      r.content,
      LEFT(r.content, 20) AS content_preview,   -- 내용 일부만
      r.likes,
      r.created_at,
      u.nickname AS user_name,
      jc.name AS job_category_name
    FROM review r
    LEFT JOIN user u ON r.user_id = u.id
    LEFT JOIN job_category jc ON r.job_category_id = jc.id
  `;

  const order = ` ORDER BY r.created_at DESC`;

  if (jobCategoryId) {
    const [rows] = await pool.execute(
      baseQuery + ` WHERE r.job_category_id = ? ` + order,
      [jobCategoryId]
    );
    return rows;
  }

  const [rows] = await pool.execute(baseQuery + order);
  return rows;
};

// 상세 조회
export const findAdminReviewDetail = async (reviewId) => {
  const query = `
    SELECT 
      r.id,
      r.company_name,
      r.content,
      r.interview_tip,
      r.likes,
      r.created_at,
      u.nickname AS user_name,
      u.email AS user_email,
      jc.name AS job_category_name
    FROM review r
    LEFT JOIN user u ON r.user_id = u.id
    LEFT JOIN job_category jc ON r.job_category_id = jc.id
    WHERE r.id = ?
  `;

  const [rows] = await pool.execute(query, [reviewId]);
  return rows[0];
};

// 수정
export const updateReviewByAdmin = async (reviewId, adminId, updateData) => {
  const { company_name, job_category_id, content, interview_tip } = updateData;

  const query = `
    UPDATE review
    SET 
      company_name = ?,
      job_category_id = ?,
      content = ?,
      interview_tip = ?,
      edited_by_admin_id = ?
    WHERE id = ?
  `;

  const params = [
    company_name,
    job_category_id,
    content,
    interview_tip,
    adminId,
    reviewId
  ];

  const [result] = await pool.execute(query, params);
  return result;
};

// 리뷰 좋아요 먼저 삭제
export const deleteReviewLikes = async (reviewId) => {
  const query = `
    DELETE FROM review_likes
    WHERE review_id = ?
  `;
  await pool.execute(query, [reviewId]);
};

// 리뷰 삭제
export const deleteReviewById = async (reviewId) => {
  const query = `
    DELETE FROM review
    WHERE id = ?
  `;

  const [result] = await pool.execute(query, [reviewId]);
  return result.affectedRows; // 삭제된 row 수 반환
};