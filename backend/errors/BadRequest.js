import CustomError from "./CustomError";
import httpStatusCodes from "http-status-codes";

class BadRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
