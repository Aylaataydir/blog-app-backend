'use strict';
import jwt from 'jsonwebtoken';
import type { UserDocument } from '../types/user.types.js';

export const generateAccessToken = (user: UserDocument ) => {
  const accessData = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(accessData, process.env.ACCESS_KEY as string);
};

export const generateRefreshToken = (user: UserDocument) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_KEY as string, {
    expiresIn: '7d',
  });
};
