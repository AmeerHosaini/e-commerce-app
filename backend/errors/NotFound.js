import CustomError from "./CustomError";
import httpStatusCodes from "http-status-codes";

class NotFound extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.NOT_FOUND;
  }
}

export default NotFound;
