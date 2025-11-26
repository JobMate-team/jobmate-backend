import { pool } from "../db.config.js";

// 좋아요 눌렀는지 체크
export const getLikeByUserRepo = async (reviewId, userId) => {
  const sql = `SELECT * FROM review_likes WHERE review_id = ? AND user_id = ?`;
  const [rows] = await pool.query(sql, [reviewId, userId]);
  return rows[0];
};

// 좋아요 추가
export const addLikeRepo = async (reviewId, userId) => {
  const sql = `
    INSERT INTO review_likes (review_id, user_id, created_at)
    VALUES (?, ?, NOW())
  `;
  await pool.query(sql, [reviewId, userId]);
};

// 좋아요 제거
export const removeLikeRepo = async (reviewId, userId) => {
  const sql = `DELETE FROM review_likes WHERE review_id = ? AND user_id = ?`;
  await pool.query(sql, [reviewId, userId]);
};

// review.likes 숫자 업데이트
export const updateReviewLikeCountRepo = async (reviewId, diff) => {
  const sql = `UPDATE review SET likes = likes + ? WHERE id = ?`;
  await pool.query(sql, [diff, reviewId]);
};
