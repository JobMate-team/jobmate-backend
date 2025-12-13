import { findById, updateNickname } from "../repositories/user.repository.js";

export const getMyProfileService = async (userId) => {
    const user = await findById(userId);

    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    return {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        provider: user.provider,
        jobCategory: user.job_category_id
          ? {
              id: user.job_category_id,
              name: user.job_category_name,
            }
          : null,
    };
};

export const updateMyNicknameService = async (userId, nickname) => {
    if (!nickname) throw new Error("닉네임을 입력하세요.");

    const updated = await updateNickname(userId, nickname);
    if (!updated) throw new Error("닉네임 수정에 실패했습니다.");

    return { message: "닉네임이 성공적으로 변경되었습니다." };
};