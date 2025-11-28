import { userRepository } from "../repositories/user.repository.js";

//JWT 검증 후 user PK(id)로 DB 조회 → 프로필 반환
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Middleware 리턴된 값

        const user = await userRepository.findById(userId);

        if (!user) {
        return res.error({
            status: 404,
            errorCode: "USER_NOT_FOUND",
            reason: "해당 유저가 없습니다."
        });
        }

        return res.success({
        message: "프로필 조회 성공",
        user: {
            id: user.id,
            provider: user.provider,
            kakaoId: user.kakao_id,
            email: user.email,
            nickname: user.nickname
        }
        });

    } catch (err) {
        return res.error({
        status: 500,
        errorCode: "SERVER_ERROR",
        reason: err.message
        });
    }
};