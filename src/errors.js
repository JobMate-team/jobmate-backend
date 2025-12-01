export class LoginRequiredError extends Error {
  errorCode = "U001";
  constructor(reason = "로그인이 필요합니다.", data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class BadRequestError extends Error {
  errorCode = "HISTORY_ALREADY_EXISTS";
  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  errorCode = "FORBIDDEN";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}