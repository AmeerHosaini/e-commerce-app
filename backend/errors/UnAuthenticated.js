const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class UnAuthenticated extends CustomError {
  constructor(messageKey, req) {
    super(messageKey);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.message = req.t(messageKey);
  }
}

module.exports = UnAuthenticated;
