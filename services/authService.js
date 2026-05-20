import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, userResponse } from '../utils/token.js';
import { validatePassword } from '../utils/password.js';
import { AppError } from '../middleware/errorHandler.js';

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  user.refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await user.save();
  return { accessToken, refreshToken, token: accessToken };
};

export const register = async ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError('Name, email, and password are required');
  }
  const pwdError = validatePassword(password);
  if (pwdError) throw new AppError(pwdError);

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError('Email already registered', 409);

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
    role: 'user',
  });

  const tokens = await issueTokens(user);
  return { ...tokens, user: userResponse(user) };
};

export const login = async ({ email, password }) => {
  if (!email?.trim() || !password) {
    throw new AppError('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = await issueTokens(user);
  return { ...tokens, user: userResponse(user) };
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) throw new AppError('refreshToken is required');

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
  if (decoded.type && decoded.type !== 'refresh') {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(decoded.id).select('+refreshTokenHash');
  if (!user?.refreshTokenHash) {
    throw new AppError('Refresh token not recognized', 401);
  }
  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) throw new AppError('Refresh token not recognized', 401);

  return issueTokens(user);
};

export const logout = async (user) => {
  user.refreshTokenHash = null;
  user.refreshTokenExpiresAt = null;
  await user.save();
};
