import axios from "axios";
import { LoginRequiredError } from "../errors.js";
import { userRepository } from "../repositories/user.repository.js";

//카카오 로그인 화면 띄우는 URL
export const buildKakaoLoginURL = () => {
    return (
        `https://kauth.kakao.com/oauth/authorize?` +
        `client_id=${process.env.KAKAO_REST_API_KEY}` + //앱 식별하는 API_KEY
        `&redirect_uri=${process.env.KAKAO_REDIRECT_URI}` + //code 받는 URI
        `&response_type=code` //카카오 서버가 주는 임시인증 code
    );
};

//토큰 발급
export const getKakaoToken = async (code) => {
    try {
        const url = "https://kauth.kakao.com/oauth/token"; //카카오에게 토큰 요청하는 서버 주소

        const data = new URLSearchParams({
        grant_type: "authorization_code", //Oauth 방식 인증
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
        });

        //카카오 서버에 post 요청 전송
        const res = await axios.post(url, data, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        return res.data.access_token; //post응답으로 카카오 서버가 토큰 반환(JSON)
    } catch (err) {
        console.error("KAKAO TOKEN ERROR", err.response?.data || err.message);

    throw new LoginRequiredError(
        "카카오 access_token 발급 실패",
        err.response?.data
        );
    }  
};

//받은 토큰으로 유저 정보 조회
export const getKakaoUserInfo = async (access_token) => {
    try {
        const res = await axios.get("https://kapi.kakao.com/v2/user/me", { //토큰으로 카카오 서버에 유저 정보 조회 get 요청
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        });

        return res.data;//카카오 서버의 유저 정보 응답(id, email, nickname...)
    } catch (err) {
        console.error("KAKAO USER INFO ERROR", err.response?.data || err.message);

        throw new LoginRequiredError(
        "카카오 사용자 정보 조회 실패",
        err.response?.data
        );
    }
};


export const loginWithKakao = async (kakaoUser) => { //카카오 API에서 받아온 사용자 정보(JSON)
    const provider = "kakao";
    const kakao_id = String(kakaoUser.id); //id
    const email = kakaoUser.kakao_account?.email || null; //이메일
    const nickname = kakaoUser.kakao_account?.profile?.nickname || `kakao_user_${kakaoUser.id}`; //NULL 값일 때 에러 발생

    let user = await userRepository.findByProviderId(provider, kakao_id);

    if (!user) { //기존 user 아니면 DB에 추가
        const newId = await userRepository.createUser(
        provider,
        kakao_id,
        email,
        nickname
        );

        user = {
        id: newId,
        provider,
        kakao_id,
        email,
        nickname
        };
    }

    return user; //DB에서 찾은 사용자 객체 전달
};