// 로그인 필요 에러 (401)
export class LoginRequiredError extends Error {
  statusCode = 401;
  errorCode = "LOGIN_REQUIRED";

  constructor(reason = "로그인이 필요합니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 잘못된 요청 (400) 
export class BadRequestError extends Error {
  statusCode = 400;
  errorCode = "HISTORY_ALREADY_EXISTS";

  constructor(reason = "잘못된 요청입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 권한 없음 (403)
export class ForbiddenError extends Error {
  statusCode = 403;
  errorCode = "FORBIDDEN";

  constructor(reason = "접근 권한이 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 조회 실패 (404)
export class NotFoundError extends Error {
  statusCode = 404;
  errorCode = "NOT_FOUND";

  constructor(reason = "요청한 리소스를 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
