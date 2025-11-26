export class LoginRequiredError extends Error {
  errorCode = "U001";
  constructor(reason = "로그인이 필요합니다.", data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
