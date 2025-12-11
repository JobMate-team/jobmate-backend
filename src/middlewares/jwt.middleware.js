import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.config.js";

// AccessToken 검증 (쿠키 기반)
export const verifyServiceAccessJWT = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.error({
            status: 401,
            errorCode: "NO_TOKEN",
            reason: "Access token required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "access") {
            return res.error({
                status: 401,
                errorCode: "INVALID_TOKEN_TYPE",
                reason: "Not an access token"
            });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role || "user"
        };

        next();

    } catch (err) {
        return res.error({
            status: 401,
            errorCode: "INVALID_OR_EXPIRED",
            reason: err.message
        });
    }
};


// RefreshToken 검증 (쿠키 기반)
export const verifyRefreshJWT = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.error({
            status: 401,
            errorCode: "NO_REFRESH_TOKEN",
            reason: "Refresh token required"
        });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (payload.type !== "refresh") {
            return res.error({
                status: 401,
                errorCode: "INVALID_TOKEN_TYPE",
                reason: "Not a refresh token"
            });
        }

        const redisKey = payload.role === "admin"
            ? `admin-refresh:${payload.id}`
            : `refresh:${payload.id}`;

        const stored = await redisClient.get(redisKey);

        if (!stored || stored !== refreshToken) {
            return res.error({
                status: 401,
                errorCode: "REFRESH_NOT_ACTIVE",
                reason: "Refresh token expired or not active"
            });
        }

        req.user = { id: payload.id, role: payload.role };
        next();

    } catch (err) {
        return res.error({
            status: 401,
            errorCode: "INVALID_OR_EXPIRED",
            reason: err.message
        });
    }
};
