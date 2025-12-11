import { 
    buildKakaoLoginURL, 
    getKakaoToken, 
    getKakaoUserInfo, 
    loginWithKakao,
    updateJobCategoryService,
    issueAccessToken,
    rotateRefreshToken,
    logoutUser
} from "../services/auth.service.js";
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

        // 프론트 URL로 redirect 
        const redirectURL =
            `${process.env.FRONT_KAKAO_REDIRECT}?` +
            `accessToken=${tokens.accessToken}` +
            `&refreshToken=${tokens.refreshToken}` +
            `&userId=${user.id}`;

        return res.redirect(redirectURL);

    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "SERVER_ERROR",
            reason: err.message,
        });
    }
};


export const updateJobCategory = async (req, res) => {
    const userId = req.user.id;
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
 develop

export const refreshRotation = async (req, res) => {
    try {
        const userId = req.user.id;//verifyRefreshJWT 미들웨어에서 검증 끝낸 refreshToken의 id 가져옴

        const newAccessToken = await issueAccessToken(userId);
        const rotated = await rotateRefreshToken(userId);

        return res.success({
            message: "Token rotation successful",
            userId: rotated.userId, //userId는 유지
            accessToken: newAccessToken, //accessToken 교체
            refreshToken: rotated.refreshToken, //refreshToken 교체
        });
    } catch (err) {
        return res.error({ status: 401, errorCode: "ROTATION_FAIL", reason: err.message });
    }
};

export const logoutInvalidate = async (req, res) => {
    try {
        const userId = await logoutUser(req.user.id); //verifyServiceAccessJWT 미들웨어에서 검증 끝낸 accessToken의 id 가져옴

        return res.success({ message:"Logout success", userId });

    } catch (err) {
        return res.error({ status:401, errorCode:"LOGOUT_FAIL", reason: err.message });
    }
};