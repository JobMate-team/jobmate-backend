import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.config.js";
import { findAdminByEmail } from "../repositories/admin.repository.js";

export const adminLogin = async (email, password) => {
  const admin = await findAdminByEmail(email);
  if (!admin) throw new Error("관리자를 찾을 수 없습니다.");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("비밀번호가 일치하지 않습니다.");

  // admin 전용 access token
  const accessToken = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: "admin",
      type: "access"
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // admin 전용 refresh token
  const refreshToken = jwt.sign(
    {
      id: admin.id,
      role: "admin",
      type: "refresh"
    },
    process.env.JWT_SECRET,
    { expiresIn: "14d" }
  );

  // Redis 저장 (refresh rotation)
  await redisClient.set(`admin-refresh:${admin.id}`, refreshToken);

  return {
    admin: {
      id: admin.id,
      email: admin.email,
      role: "admin"
    },
    tokens: {
      accessToken,
      refreshToken
    }
  };
};
