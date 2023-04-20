const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class BadRequest extends CustomError {
  constructor(messageKey, req) {
    // super(msg);
    // this.name = "BadRequest";
    // this.statusCode = StatusCodes.BAD_REQUEST;
    // this.message = req ? req.t(msg) : msg;
    super(messageKey);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = req.t(messageKey);
  }
}

module.exports = BadRequest;
