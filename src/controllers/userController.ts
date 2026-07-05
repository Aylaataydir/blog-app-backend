

"use strict";

import { Request, Response } from 'express'
import CustomError from "../helpers/customError.js";
import { toUserDTO } from "../helpers/toUserDTO.js";
import User from "../models/User.js";
import type { ChangePasswordInput, UpdateUserInput } from '../validations/user.validation.js';


export const list = async (
    req: Request, 
    res: Response
): Promise<void> => {
    /* 

            #swagger.tags = ['Users']
            #swagger.summary = 'List Users'
            #swagger.desription = `
                You can sen query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples usage:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    // console.log('list controller calisiyor')
    const customFilter = req.user.isAdmin ? {} : { _id: req.user._id };

    const data = await res.getModelList(User, customFilter)

    if (!data) {
        throw new CustomError('User not found', 404);
    }


    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(User, customFilter),
        user: toUserDTO(data)
    })
}


export const read = async (
    req: Request<{id: string}>, 
    res: Response
): Promise<void> => {
    /* 
            #swagger.tags = ['Users']
            #swagger.summary = 'Get Single User'
        */


    console.log('userId', req.params)

    const userId = req.user._id

    console.log('userId var', userId)

    const data = await User.findOne({ _id: userId });

    if (!data) {
        throw new CustomError('User not found', 404);
    }


    res.status(200).send({
        error: false,
        user: toUserDTO(data)
    });
}

export const update = async (
    req: Request<{id: string}, {}, UpdateUserInput>,
    res: Response
): Promise<void> => {
    /* 
            #swagger.tags = ['Users']
            #swagger.summary = 'Update User'
        */

    const validatedData = req.body

    const userId = req.user._id

    const data = await User.findByIdAndUpdate(userId, validatedData, {
        runValidators: true,
        new: true,
    });


    res.status(200).send({
        error: false,
        user: toUserDTO(data)
    });
}

export const updatePassword = async (
    req: Request<{id: string}, {}, ChangePasswordInput>, 
    res: Response
): Promise<void> => {

    console.log('updatepasswordUser', req.body)

    const validatedData = req.body
    const userId = req.user._id

    const user = await User.findById(userId).select("+password")

    if (!user) throw new CustomError('User not found', 404)

    const isMatch = await user.matchPassword(validatedData.currentPassword)

    if (!isMatch) throw new CustomError('Current password is incorrect', 400)

    user.password = validatedData.newPassword
    await user.save()


    res.status(200).send({
        error: false,
        message: 'Password updated successfully'
    });

}

export const deletee = async (
    req: Request<{id:string}, {}, {}>, 
    res: Response
): Promise<void> => {
    /* 
            #swagger.tags = ['Users']
            #swagger.summary = 'Delete User'
        */
    const userId = req.user._id;

    const data = await User.findByIdAndDelete(userId);

    if (!data) {
        throw new CustomError(
            'User not found or already deleted.',
            404
        );
    }

    res.sendStatus(204);
}



