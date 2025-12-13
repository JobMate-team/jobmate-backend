import { pool } from "../db.config.js";

export const findByProviderId = async (provider, kakao_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM user WHERE provider = ? AND kakao_id = ?",
        [provider, kakao_id]
    );
    return rows[0] || null;
};

export const createUser = async (provider, kakao_id, email, nickname, job_category_id) => {
    const [result] = await pool.query(
        "INSERT INTO user(provider, kakao_id, email, nickname, job_category_id) VALUES (?, ?, ?, ?, ?)",
        [provider, kakao_id, email, nickname, job_category_id]
    );
    return result.insertId;
};

export const findById = async (id) => {
    const sql = `
      SELECT
        u.id,
        u.kakao_id,
        u.nickname,
        u.email,
        u.provider,
        u.job_category_id,
        jc.name AS job_category_name
      FROM user u
      LEFT JOIN job_category jc
        ON u.job_category_id = jc.id
      WHERE u.id = ?
    `;

    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
};

export const updateJobCategoryRepo = async (userId, jobCategoryId) => {
    await pool.query(
        "UPDATE user SET job_category_id = ? WHERE id = ?",
        [jobCategoryId, userId]
    );
};

export const updateNickname = async (userId, nickname) => {
    const [result] = await pool.query(
        "UPDATE user SET nickname = ? WHERE id = ?",
        [nickname, userId]
    );
    return result.affectedRows > 0;
};