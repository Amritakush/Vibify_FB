import ApiError from "../utils/ApiError.js";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const validateRegister = (body) => {
  // Express 5 me body khaali ho to undefined aata hai, isliye ?? {}
  const { name, email, password } = body ?? {};
  const errors = [];

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
    errors.push({ field: "name", message: "Name must be 2 to 50 characters" });
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email" });
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    errors.push({ field: "password", message: "Password must be 8 to 72 characters" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  return { name: name.trim(), email: email.trim().toLowerCase(), password };
};

export const validateLogin = (body) => {
  const { email, password } = body ?? {};
  const errors = [];

  if (typeof email !== "string" || email.trim() === "") {
    errors.push({ field: "email", message: "Email is required" });
  }
  if (typeof password !== "string" || password === "") {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  return { email: email.trim().toLowerCase(), password };
};