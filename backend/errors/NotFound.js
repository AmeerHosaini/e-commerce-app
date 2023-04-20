const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");

class NotFound extends CustomError {
  constructor(messageKey, req, params = {}) {
    super(messageKey);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.message = req.t(messageKey, params);
  }
}

module.exports = NotFound;
