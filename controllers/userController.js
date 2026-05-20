import * as userService from '../services/userService.js';

export const list = async (req, res) => {
  const result = await userService.listUsers(req.query);
  res.json(result);
};
