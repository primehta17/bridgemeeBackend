import jwt from 'jsonwebtoken';

export const signAccessToken = (userId) =>
  jwt.sign({ id: userId, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const signRefreshToken = (userId) =>
  jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

export const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
