
"use strict"

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import CustomError from "../helpers/customError.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/generateJwt.js";
import { toUserDTO } from "../helpers/toUserDTO.js";
import { Request, Response } from "express";
import type { CreateUserInput, LoginInput, RefreshBody } from "../validations/user.validation.js";


export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
): Promise<void> => {

  const validatedData = req.body;

  // console.log('validatedData', validatedData)

  const user = await User.findOne({
    $or: [
      { email: validatedData.login },
      { username: validatedData.login }
    ]
  }).select("+password")

  // console.log('user', user)

  if (!user) throw new CustomError("Wrong email/username or password", 401);


  //password compare
  const isMatchingPassword = await user.matchPassword(validatedData.password)

  if (!isMatchingPassword) {
    throw new CustomError('Invalid email or password.', 404)
  }

  if (!user.isActive)
    throw new CustomError("The user status is not active", 401);

  // if (!user.isEmailVerified)
  //   throw new CustomError("The user email is not verified", 401);

  //token create
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  console.log('tokens', refreshToken)


  res.status(200).send({
    error: false,
    bearer: {
      accessToken,
      refreshToken
    },
    user: toUserDTO(user)
  })
}

export const register = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<void> => {

  const validatedData = req.body;
  // console.log('validate data', validatedData)

  const userExists = await User.findOne({
    $or: [{ email: validatedData.email }, { username: validatedData.username }],
  });

  if (userExists) {
    throw new CustomError('Email or username is already registered.', 409);
  }

  const newUser = await User.create(validatedData as any)

  // console.log('newUser', newUser)

  //token create
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);


  res.status(201).send({
    error: false,
    accessToken,
    refreshToken,
    user: toUserDTO(newUser)
  });
};




export const logout = async (req: Request, res: Response) => {

  res.status(200).send({
    error: false,
    message: 'logout is successful'
  });

}


export const refresh = async (req: Request<{}, {}, RefreshBody>, res: Response) => {

  const { refreshToken } = req.body

  if (!refreshToken) throw new CustomError("Refresh token is missing.", 400);

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_KEY as string
  ) as { id: string };


  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new CustomError("Invalid token or user not found", 401);
  }

  const accessToken = generateAccessToken(user);

  res.status(200).json({
    error: false,
    accessToken,
  });

}


