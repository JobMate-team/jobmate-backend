import { pool } from "../db.config.js";

export const findAdminByEmail = async (email) => {
  const sql = `SELECT * FROM admin WHERE email = ? LIMIT 1`;
  const [rows] = await pool.query(sql, [email]);
  return rows[0];
};
