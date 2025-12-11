import { getMyProfileService, updateMyNicknameService } from "../services/user.service.js";

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await getMyProfileService(userId);
        return res.success(profile);

    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "PROFILE_FETCH_ERROR",
            reason: err.message
        });
    }
};

export const updateMyNickname = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nickname } = req.body;

        const result = await updateMyNicknameService(userId, nickname);
        return res.success(result);

    } catch (err) {
        return res.error({
            status: 500,
            errorCode: "PROFILE_UPDATE_ERROR",
            reason: err.message
        });
    }
};