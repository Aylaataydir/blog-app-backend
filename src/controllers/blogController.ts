
"use strict";

import Blog from "../models/Blog.js";
import { Request, Response } from 'express'
import type { CreateBlogInput, UpdateBlogInput } from "../validations/blog.validation.js";
import Category from "../models/Category.js";
import Comments from "../models/Comment.js";
import CustomError from "../helpers/customError.js";
import User from "../models/User.js";
import mongoose from "mongoose";


export const list = async (
    req: Request,
    res: Response
): Promise<void> => {

    const data = await res.getModelList(Blog, {}, [
        { path: "categoryId", select: "name" },
        { path: "userId", select: "username email firstName lastName avatar" },
        {
            path: "comments",
            populate: {
                path: "userId",
                select: "username avatar"
            }
        }
    ]);

    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Blog),
        data,
    });
}

export const create = async (
    req: Request<{}, {}, CreateBlogInput>,
    res: Response
): Promise<void> => {

    const validatedData = req.body
    const userId = req.user._id

    const categoryExists = await Category.findById(validatedData.categoryId)

    if (!categoryExists) throw new CustomError('Category not found', 404)

    const blogExists = await Blog.findOne({ title: validatedData.title })

    if (blogExists) throw new CustomError('A blog with this title already exists', 409)


    const data = await Blog.create({
        ...validatedData,
        userId
    });

    res.status(201).send({
        error: false,
        data,
    });
}


export const read = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {


    // check if user logged in

    const data = await Blog.findByIdAndUpdate(req.params.id,
        { $inc: { countOfVisitors: 1 } },
        { new: true }
    )
        .populate({ path: "categoryId", select: "name" })
        .populate({ path: "userId", select: "username firstName lastName avatar" })
        .populate({
            path: "comments",
            populate: {
                path: "userId",
                select: "username avatar"
            }
        });

    if (!data) throw new CustomError('Blog not found', 404)


    res.status(200).send({
        error: false,
        data,
    });
}

export const update = async (
    req: Request<{ id: string }, {}, UpdateBlogInput>,
    res: Response
): Promise<void> => {



    const blog = await Blog.findById(req.params.id);

    const validatedData = req.body

    if (!blog) {
        throw new CustomError("Blog not found", 404);
    }

    if (blog.userId._id.toString() !== req.user._id.toString()) {
        throw new CustomError("you can not update someone else blog.", 401);
    }

    Object.assign(blog, validatedData)
    await blog.save()

    res.status(200).send({
        error: false,
        data: blog
    });
}

export const deletee = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {

    const data = await Blog.findByIdAndDelete(req.params.id);

    if (!data) {
        throw new CustomError(
            'Blog not found or already deleted.',
            404
        );
    }

    res.sendStatus(204);

}

export const getLike = async (
    req: Request,
    res: Response
): Promise<void> => {

}


export const postLike = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {


    const blog = await Blog.findById(req.params.id)

    if (!blog) throw new CustomError('Blog not found', 404)

    const userId = req.user._id.toString()

    const alreadyLiked = blog.likes.some(id => id.toString() === userId)

    const session = await mongoose.startSession() 

    try {
        session.startTransaction()

        if (alreadyLiked) {
            await Blog.findByIdAndUpdate(
                blog._id,
                { $pull: { likes: userId } },
                { session }
            )

            await User.findByIdAndUpdate(
                userId,
                { $pull: { likedBlogs: blog._id } },
                { session }
            )
        } else {
            await Blog.findByIdAndUpdate(
                blog._id,
                { $addToSet: { likes: userId } },
                { session }
            )

            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { likedBlogs: blog._id } },
                { session }
            )
        }

        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        session.endSession()
    }


    res.status(200).send({
        error: false,
        liked: !alreadyLiked,
        blogId: blog._id
    })
}


export const saveBlog = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {


    const blog = await Blog.findById(req.params.id)

    if (!blog) throw new CustomError('Blog not found', 404)

    const userId = req.user._id.toString()

    const alreadySaved = blog.saves.some(id => id.toString() === userId)

    console.log(alreadySaved)

    const session = await mongoose.startSession() 

    try {
        session.startTransaction()

        if (alreadySaved) {
            await Blog.findByIdAndUpdate(
                blog._id,
                { $pull: { saves: userId } },
                { session }
            )

            await User.findByIdAndUpdate(
                userId,
                { $pull: { savedBlogs: blog._id } },
                { session }
            )
        } else {
            await Blog.findByIdAndUpdate(
                blog._id,
                { $addToSet: { saves: userId } },
                { session }
            )

            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { savedBlogs: blog._id } },
                { session }
            )
        }

        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        session.endSession()
    }


    res.status(200).send({
        error: false,
        saved: !alreadySaved,
        blogId: blog._id
    })
}
