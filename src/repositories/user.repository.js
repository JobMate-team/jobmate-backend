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
    const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
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