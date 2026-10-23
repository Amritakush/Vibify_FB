import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { COOKIE_NAME, verifyToken } from "../utils/token.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, "Account no longer exists");
  }

  req.user = user; // aage ke controllers yahin se pata kar sakte hain ki kaun login hai
  next();
};