"use strict"

import jwt from "jsonwebtoken";
import CustomError from "../helpers/customError.js";
import User from "../models/User.js";

import { Request, Response, NextFunction } from "express";

const authentication = async (
    req: Request, 
    res:Response, 
    next: NextFunction): Promise<void> => {

    const authHeader = req.headers.authorization

    console.log('authHeader', authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError('AuthenticationError: Token not found.', 401)
    }

    const token = authHeader.split(' ')[1]

    console.log('token', token)

    let decoded: { _id: string }

    try {
        decoded = jwt.verify(token, process.env.ACCESS_KEY as string) as { _id: string } ;
    } catch {
        throw new CustomError("Invalid or expired token.", 401);
    }

   
    const user = await User.findById(decoded._id)

    console.log('decoded token', decoded)

    if (!user) {
        throw new CustomError('User not found', 401)
    }

    if (!user.isActive) {
        throw new CustomError('User is not active.', 403)
    }

    req.user = user

    next()
}

export default authentication