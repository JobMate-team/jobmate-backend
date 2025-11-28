import { pool } from "../db.config.js";

export const userRepository = { //유저 조회
    findByProviderId: async (provider, kakao_id) => {
        const [rows] = await pool.query(
        "SELECT * FROM user WHERE provider = ? AND kakao_id = ?",
        [provider, kakao_id]
        );
        return rows[0] || null;
    },

    createUser: async (provider, kakao_id, email, nickname, job_category_id) => { //유저 생성
        const [result] = await pool.query(
        "INSERT INTO user(provider, kakao_id, email, nickname, job_category_id) VALUES (?, ?, ?, ?, ?)",
        [provider, kakao_id, email, nickname, job_category_id]
        );
        return result.insertId;
    },

    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
        return rows[0] || null;
    }
    
};