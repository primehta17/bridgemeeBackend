import * as authService from '../services/authService.js';
import { userResponse } from '../utils/token.js';

export const register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};

export const refresh = async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(result);
};

export const logout = async (req, res) => {
  await authService.logout(req.user);
  res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  res.json({ user: userResponse(req.user) });
};
