import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { signToken } from "../utils/token.js";

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.exists({ email });
  if (exists) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password }); // password model me hash hota hai
  return { user, token: signToken(user._id) };
};

export const loginUser = async ({ email, password }) => {
  // password field default me chhupa hai, yahan khud maangna padta hai
  const user = await User.findOne({ email }).select("+password");
  const passwordMatches = user && (await user.comparePassword(password));

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  return { user, token: signToken(user._id) };
};