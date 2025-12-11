import { pool } from "../db.config.js";

export const getAdminUserList = async ({ search, jobCategory, page, limit }) => {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT 
        u.id, u.nickname, u.email,
        jc.name AS job_category_name,
        u.created_at,
        COALESCE(cs.coaching_count, 0) AS coaching_count,
        COALESCE(rv.review_count, 0) AS review_count
    FROM user u
    LEFT JOIN job_category jc 
        ON u.job_category_id = jc.id
    LEFT JOIN (
        SELECT user_id, COUNT(*) AS coaching_count
        FROM coaching_session
        GROUP BY user_id
    ) cs ON cs.user_id = u.id
    LEFT JOIN (
        SELECT user_id, COUNT(*) AS review_count
        FROM review
        GROUP BY user_id
    ) rv ON rv.user_id = u.id
    WHERE ( 
        ? IS NULL OR u.nickname LIKE CONCAT('%', ?, '%') 
          OR u.email LIKE CONCAT('%', ?, '%')
    )
    AND (
        ? IS NULL OR u.job_category_id = ?
    )
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(sql, [
    search || null,
    search || null,
    search || null,
    jobCategory || null,
    jobCategory || null,
    limit,
    offset,
  ]);

  return rows;
};

export const getUserDashboardStats = async () => {
  const [[totalUsers]] = await pool.query(
    "SELECT COUNT(*) AS total_users FROM user"
  );

  const [[totalCoaching]] = await pool.query(
    "SELECT COUNT(*) AS total_coaching FROM coaching_session"
  );

  const [[totalReviews]] = await pool.query(
    "SELECT COUNT(*) AS total_reviews FROM review"
  );

  const [[todayCoaching]] = await pool.query(
    "SELECT COUNT(*) AS today_coaching FROM coaching_session WHERE DATE(created_at) = CURDATE()"
  );

  const [[todayReviews]] = await pool.query(
    "SELECT COUNT(*) AS today_reviews FROM review WHERE DATE(created_at) = CURDATE()"
  );

  return {
    total_users: totalUsers.total_users,
    total_coaching: totalCoaching.total_coaching,
    total_reviews: totalReviews.total_reviews,
    today_activity: todayCoaching.today_coaching + todayReviews.today_reviews,
  };
};