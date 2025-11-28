export const authRequired = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.error({
      status: 401,
      errorCode: "LOGIN_REQUIRED",
      reason: "로그인이 필요합니다."
    });
  }
  next();
};
