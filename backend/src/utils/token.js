import jwt from "jsonwebtoken";

export const COOKIE_NAME = "vibify_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 din, JWT_EXPIRES_IN=7d ke barabar

const cookieOptions = () => ({
  httpOnly: true, // browser ka JavaScript is cookie ko padh nahi sakta
  sameSite: "lax", // dusri sites se aane wali risky requests me cookie nahi jaati
  secure: process.env.NODE_ENV === "production", // production me sirf HTTPS par
  path: "/",
});

export const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const setAuthCookie = (res, token) =>
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: COOKIE_MAX_AGE });

export const clearAuthCookie = (res) => res.clearCookie(COOKIE_NAME, cookieOptions());