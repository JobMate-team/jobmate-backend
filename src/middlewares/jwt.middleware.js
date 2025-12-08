import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.config.js";

//accessToken 검증
export const verifyServiceAccessJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.error({ status: 401, errorCode: "NO_TOKEN", reason: "Access token required" });
    }

    const token = authHeader.split(" ")[1]; //토큰 값만 split

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== "access") { //accessToken type이 맞는지
        return res.error({ status: 401, errorCode: "INVALID_TOKEN_TYPE", reason: "Not an access token" });
        }
        
        req.user = { 
            id: decoded.id,
            role: decoded.role || "user"   // 기본값 user
        };
        
        next();
    } catch (err) {
        return res.error({ status: 401, errorCode: "INVALID_OR_EXPIRED", reason: err.message });
    }
};

//refreshToken 검증
export const verifyRefreshJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.error({ status: 401, errorCode: "NO_TOKEN", reason: "Refresh token required" });
    }

    const refreshToken = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (payload.type !== "refresh") { //refreshToken type이 맞는지
            return res.error({ status: 401, errorCode: "INVALID_TOKEN_TYPE", reason: "Not a refresh token" });
        }

        // rotation 전 상태 검증을 위해 Redis에서 active Refresh와 동일한지 비교도 여기서 처리
        const redisKey = `refresh:${payload.id}`;
        const stored = await redisClient.get(redisKey);
        if (!stored || stored !== refreshToken) {
            return res.error({ status: 401, errorCode: "REFRESH_NOT_ACTIVE", reason: "Refresh token expired or not active in Redis." });
        }

        req.user = { id: payload.id };
        next();

    } catch (err) {
        return res.error({ status: 401, errorCode: "INVALID_OR_EXPIRED", reason: err.message });
    }
};