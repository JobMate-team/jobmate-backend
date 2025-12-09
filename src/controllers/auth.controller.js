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
        const { code } = req.query;//URL에서 쿼리 파라미터 추출. 프론트 있으면 req.body로 변경 필요

        const kakao_accessToken = await getKakaoToken(code); //URL code를 통해 token 가져오기
        const kakaoUser = await getKakaoUserInfo(kakao_accessToken); //토큰으로 유저 정보 가져오기
        const { user, tokens } = await loginWithKakao(kakaoUser); //유저 정보 확인 or DB 저장 후 user객체 반환

        return res.success({ //redirect 변환 여부 확인
            message: "카카오 로그인 성공",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            id: user.id,
            job_category_id: user.job_category_id,
            user: {
                kakaoId: user.kakao_id,
                nickname: user.nickname,
                email: user.email
            }
        });
    } catch (err) {
        if (err instanceof LoginRequiredError) {
        return res.error({
            status: 401,
            errorCode: err.errorCode,
            reason: err.reason,
            data: err.data,
        });
        }

        //일반 에러
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