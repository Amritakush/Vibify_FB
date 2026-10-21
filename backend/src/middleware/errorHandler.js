import ApiError from "../utils/ApiError.js";

// Koi route match na ho to 404 error banao
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Express isse error handler tabhi samajhta hai jab function ke 4 parameters hon
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors;

  // Galat JSON body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }
  // Mongoose validation fail (jaise required field missing)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // Galat MongoDB id format
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }
  // Duplicate value (jaise same email dobara)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `${field} already exists`;
  }

  // 500 errors hamari galti hote hain: console me poora error, user ko generic message
  if (statusCode >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
      message = "Internal server error";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};