export const adminOnly = (req, res, next) => {
  if (!req.isAdmin) {
    return res.error({
      status: 403,
      errorCode: "ADMIN_ONLY",
      reason: "관리자 전용 API입니다."
    });
  }
  next();
};
