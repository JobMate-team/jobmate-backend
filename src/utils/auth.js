import { verifyToken } from "./jwt-test.js";
import { LoginRequiredError } from "../errors.js";

export const getAuthUserId = (req) => {
  console.log("DEBUG JWT_SECRET:", process.env.JWT_SECRET);


  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new LoginRequiredError();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    return decoded.user_id;
  } catch (err) {
    throw new LoginRequiredError("유효하지 않은 인증 토큰입니다.");
  }
};
