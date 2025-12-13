import { findById, updateNickname } from "../repositories/user.repository.js";
import { findAdminById } from "../repositories/admin.repository.js";

export const getMyProfileService = async (id, role) => {

  if (role === "admin") {
    const admin = await findAdminById(id);
    if (!admin) throw new Error("관리자를 찾을 수 없습니다.");

    return {
      role: "admin",
      id: admin.id,
      email: admin.email,
      name: admin.name
    };
  }

  const user = await findById(id);
  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  return {
    role: "user",
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

export const updateMyNicknameService = async (id, role, nickname) => {
  if (role === "admin") {
    throw new Error("관리자는 닉네임을 수정할 수 없습니다.");
  }

  if (!nickname) throw new Error("닉네임을 입력하세요.");

  const updated = await updateNickname(id, nickname);
  if (!updated) throw new Error("닉네임 수정에 실패했습니다.");

  return { message: "닉네임이 성공적으로 변경되었습니다." };
};
