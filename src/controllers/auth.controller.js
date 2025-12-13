import { buildKakaoLoginURL,
    getKakaoToken,
    getKakaoUserInfo, 
    loginWithKakao,
    getMyInfoService,
    updateJobCategoryService,
    issueAccessToken,
    rotateRefreshToken,
    logoutUser,

} from "../services/auth.service.js";
import { redisClient } from "../config/redis.config.js";
import { LoginRequiredError } from "../errors.js";

export const kakaoLoginRedirect = (req, res) => {
    const kakaoURL = buildKakaoLoginURL(); //로그인 화면 URL
    return res.redirect(kakaoURL); //로그인 화면으로 redirect
};

export const kakaoCallback = async (req, res) => {
    try {
        const { code } = req.query;

        const kakao_accessToken = await getKakaoToken(code);
        const kakaoUser = await getKakaoUserInfo(kakao_accessToken);
        const { user, tokens } = await loginWithKakao(kakaoUser);

        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",   // 배포 시 true
            sameSite: process.env.COOKIE_SAMESITE,
            maxAge: 1000 * 60 * 30, // 30분
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",  // 배포 시 true
            sameSite: process.env.COOKIE_SAMESITE,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        });

        // FE로 redirect (토큰은 절대 노출하지 않음)
        return res.redirect(process.env.CLIENT_SUCCESS_REDIRECT);

    } catch (err) {

        // LoginRequiredError라도 redirect 하지 않음 → JSON으로 에러 반환
        return res.error({
            status: 400,
            errorCode: "KAKAO_LOGIN_FAILED",
            reason: err.message || "Kakao login failed"
        });
    }
};


export const getMyInfo = async (req, res) => {
  try {
    const { id, role } = req.user;

    // 관리자
    if (role === "admin") {
      const admin = await findAdminById(id);

      if (!admin) {
        return res.error({
          status: 404,
          reason: "Admin not found",
        });
      }

      return res.success({
        id: admin.id,
        email: admin.email,
        role: "admin",
      });
    }

    // 일반 사용자
    const user = await getMyInfoService(id);

    return res.success({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      job_category_id: user.job_category_id,
      role: "user",
    });

  } catch (err) {
    return res.error({
      status: 500,
      reason: err.message,
    });
  }
};


export const updateJobCategory = async (req, res) => {
    const userId = req.user.id;              // JWT에서 가져옴
    const { job_category_id } = req.body;

    if (!job_category_id) {
        return res.error({
            status: 400,
            errorCode: "JOB_CATEGORY_REQUIRED",
            reason: "job_category_id가 필요합니다."
        });
    }

    try {
        await updateJobCategoryService(userId, job_category_id);
        return res.success({ message: "직무가 업데이트되었습니다." });
    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "JOB_CATEGORY_UPDATE_FAIL",
            reason: err.message
        });
    }
};


export const refreshRotation = async (req, res) => {
  try {
    const userId = req.user.id;

    const newAccessToken = await issueAccessToken(userId);
    const rotated = await rotateRefreshToken(userId);

    // accessToken 쿠키 재설정
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: 1000 * 60 * 30,
    });

    // refreshToken 쿠키 재설정
    res.cookie("refreshToken", rotated.refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.success({
      message: "Token rotation successful",
      userId,
    });

  } catch (err) {
    return res.error({
      status: 401,
      errorCode: "ROTATION_FAIL",
      reason: err.message,
    });
  }
};


export const logoutInvalidate = async (req, res) => {
  try {
    const { id, role } = req.user;

    // 1) Redis refreshToken 삭제
    const redisKey = role === "admin"
      ? `admin-refresh:${id}`
      : `refresh:${id}`;

    await redisClient.del(redisKey);

    // 2) 쿠키 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
    });

    // 3) 응답 반환
    return res.success({
      message: "Logout success",
      userId: id,
    });

  } catch (err) {
    return res.error({
      status: 401,
      errorCode: "LOGOUT_FAIL",
      reason: err.message,
    });
  }
};