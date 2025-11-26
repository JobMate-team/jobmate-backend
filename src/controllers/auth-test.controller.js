import { generateToken } from "../utils/jwt-test.js";
import { pool } from "../db.config.js";

export const mockLoginController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.error({
        status: 400,
        errorCode: "USER_ID_REQUIRED",
        reason: "user_id를 입력해야 합니다."
      });
    }

    // DB에 사용자 존재 여부 확인
    const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [user_id]);
    if (!rows[0]) {
      return res.error({
        status: 404,
        errorCode: "USER_NOT_FOUND",
        reason: "해당 user_id의 사용자가 존재하지 않습니다."
      });
    }

    // JWT 생성
    const token = generateToken({
      user_id: rows[0].id,
      nickname: rows[0].nickname
    });

    return res.success({
      message: "Mock 로그인 성공",
      access_token: token,
      user: {
        id: rows[0].id,
        nickname: rows[0].nickname
      }
    });

  } catch (err) {
    console.error(err);
    return res.error({
      status: 500,
      errorCode: "MOCK_LOGIN_FAILED",
      reason: err.message
    });
  }
};
