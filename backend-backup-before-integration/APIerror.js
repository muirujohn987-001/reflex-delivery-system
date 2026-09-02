
/**
 * Standard error type for anything Ben's auth code throws on purpose
 * (bad credentials, validation failure, missing token, etc.).
 *
 * Controllers never build error JSON themselves — they throw an ApiError
 * and let middleware/errorHandler.js turn it into the response. That keeps
 * every error in the app the same shape, which is one of the "Shared
 * Rules" in the team guide.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // optional array of { field, message } for validation errors
    this.isOperational = true; // "expected" error, not a bug — safe to show statusCode/message to the client
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;