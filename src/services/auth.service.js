import axios from "axios";
import jwt from "jsonwebtoken";
import { LoginRequiredError } from "../errors.js";
import { 
    findByProviderId,
    createUser,
    findById,
    updateJobCategoryRepo
} from "../repositories/user.repository.js";
import { redisClient } from "../config/redis.config.js";

//user.id로 JWT 토큰 생성
export const generateServiceJWT = (user) => {
    const accessToken = jwt.sign( //accessToken 생성
        { id: user.id, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign( //refreshToken 생성
        { id: user.id, type: "refresh" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
}

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

    let user = await findByProviderId(provider, kakao_id);

    if (!user) { //기존 user 아니면 DB에 추가
        const newId = await createUser(provider,
            kakao_id, 
            email, 
            nickname,
        );
        user = await findById(newId);
    }

    const tokens = generateServiceJWT(user); //tokens.accessToken, tokens.refreshToken

    try{
        await redisClient.set(`refresh:${user.id}`, tokens.refreshToken, "EX", 60 * 60 * 24 * 7); //Key:user.id, Value:tokens.refreshToken
    } catch(err) {
        console.error("Redis 저장 실패:", err.message);
    }

    return { user, tokens };
};

export const updateJobCategoryService = async (userId, jobCategoryId) => {
    return updateJobCategoryRepo(userId, jobCategoryId);
};

//Access Token 만료 시(issue) 발급
export const issueAccessToken = async (userId) => {
    const newAccessToken = jwt.sign(
        { id: userId, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
    return newAccessToken;
};

//refreshToken교체
export const rotateRefreshToken = async (userId) => {
    try {
        const redisKey = `refresh:${userId}`;
        const currentRefresh = await redisClient.get(redisKey);

        if (!currentRefresh) {
            throw new Error("No active refresh token in Redis");
        }

        const newRefreshToken = jwt.sign(
            { id: userId, type: "refresh" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        //Redis에 새 Refresh Token으로 교체
        await redisClient.set(redisKey, newRefreshToken, "EX", 60 * 60 * 24 * 7);

        return { userId, refreshToken: newRefreshToken };
    } catch (err) {
        throw new Error(err.message);
    }
};

export const logoutUser = async (userId) => {
    await redisClient.del(`refresh:${userId}`); //Redis의 refresh key 삭제
    return userId; //결과 반환(안해도 됨)
};

export const updateJobCategoryService = async (userId, jobCategoryId) => {
    return updateJobCategoryRepo(userId, jobCategoryId);
};

export const getMyInfoService = async (userId) => {
    const user = await findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};