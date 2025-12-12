import { adminLogin } from "../services/admin.service.js";

export const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await adminLogin(email, password);

    // AccessToken 쿠키 저장
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",  // 배포 시 true
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: 1000 * 60 * 60 * 2  // 2시간
    });

    // RefreshToken 쿠키 저장
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: 1000 * 60 * 60 * 24 * 14  // 14일
    });

    return res.success({
      admin: result.admin   // admin 정보만 전달
    });

  } catch (err) {
    return res.error({
      status: 401,
      errorCode: "ADMIN_LOGIN_FAILED",
      reason: err.message
    });
  }
};
