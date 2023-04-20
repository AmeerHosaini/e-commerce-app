const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class ServerError extends CustomError {
  constructor(messageKey, req) {
    super(messageKey);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = req.t(messageKey);
  }
}

module.exports = ServerError;
