class ApiError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // optional: field-wise details (validation ke liye)
  }
}

export default ApiError;