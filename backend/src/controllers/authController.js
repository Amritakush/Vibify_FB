import * as authService from "../services/authService.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { setAuthCookie, clearAuthCookie } from "../utils/token.js";

export const register = async (req, res) => {
  const data = validateRegister(req.body);
  const { user, token } = await authService.registerUser(data);
  setAuthCookie(res, token);
  res.status(201).json({ success: true, data: user });
};

export const login = async (req, res) => {
  const data = validateLogin(req.body);
  const { user, token } = await authService.loginUser(data);
  setAuthCookie(res, token);
  res.status(200).json({ success: true, data: user });
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out" });
};

export const me = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};