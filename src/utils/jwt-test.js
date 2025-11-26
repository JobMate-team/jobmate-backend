import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// JWT 생성 
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }); 
};

// JWT 검증 (예외 발생 시 null 반환) 
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};