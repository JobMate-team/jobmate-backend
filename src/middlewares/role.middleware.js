// 관리자 여부를 JWT payload의 role 값으로 판단하는 미들웨어

export const setUserRole = (req, res, next) => {
  // verifyServiceAccessJWT 후에 실행되어야 req.user가 존재함
  req.isAdmin = req.user?.role === "admin";
  next();
};
