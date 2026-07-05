"use strict"

import CustomError from "../helpers/customError.js"
import { Request, Response, NextFunction } from "express";


export const isAdmin = (req:Request, res: Response, next: NextFunction):void => {
   
    if (req.user.isAdmin !== true) {
        throw new CustomError('AuthorizationError: You must be an Admin to access this resource.', 403)
    }
    next()
}
