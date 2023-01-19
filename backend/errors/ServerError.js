const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class ServerError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = ServerError;
