import { buildKakaoLoginURL, getKakaoToken, getKakaoUserInfo, loginWithKakao } from "../services/auth.service.js";
import { LoginRequiredError } from "../errors.js";

export const kakaoLoginRedirect = (req, res) => {
    const kakaoURL = buildKakaoLoginURL(); //로그인 화면 URL
    return res.redirect(kakaoURL); //로그인 화면으로 redirect
};

export const kakaoCallback = async (req, res) => {
    try {
        const { code } = req.query;//URL에서 쿼리 파라미터 추출. 프론트 있으면 req.body로 변경 필요

        const accessToken = await getKakaoToken(code); //URL code를 통해 token 가져오기
        const kakaoUser = await getKakaoUserInfo(accessToken); //토큰으로 유저 정보 가져오기
        const user = await loginWithKakao(kakaoUser); //유저 정보 DB에 저장 후 user객체 반환

        return res.success({
            message: "카카오 로그인 성공",
            kakaoUser
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