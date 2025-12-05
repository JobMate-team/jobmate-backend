import { adminLogin } from "../services/admin.service.js";

export const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await adminLogin(email, password);

    return res.success(result);
  } catch (err) {
    return res.error({
      status: 401,
      errorCode: "ADMIN_LOGIN_FAILED",
      reason: err.message
    });
  }
};
