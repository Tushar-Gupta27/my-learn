import http from "http";
class CustomError extends Error {
  statusCode;
  /**
   * @param {[statusCode: number, message: string, data?: any]} args
   */
  constructor(...args) {
    super();
    const [statusCode, message, data] = args;
    this.statusCode = statusCode;
    this.message =
      message !== undefined
        ? message
        : http.STATUS_CODES[statusCode] || "Unknown Error and Status Code";
    data != null && (this.data = data);
  }
}
//then can use it to send APP ERRORS, or send diff kind of errors for Custom Errors
