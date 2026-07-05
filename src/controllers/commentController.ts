

"use strict"

import CustomError from "../helpers/customError.js"
import Comment from "../models/Comment.js"
import { Request, Response } from 'express'
import type { CreateCommentInput, UpdateCommentInput } from "../validations/comment.validation.js"
import Blog from "../models/Blog.js"


export const list = async (
    req: Request,
    res: Response
): Promise<void> => {

    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "List Comments"
        #swagger.description = `
        You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
        <ul> Examples:
            <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
            <li>URL/?<b>limit=10&page=1</b></li>
        </ul>
        `
    */

    const customFilter = req.user.isAdmin ? {} : {userId: req.user._id}

    const data = await res.getModelList(Comment, customFilter)

    console.log("commentData", data)

    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Comment, customFilter),
        data
    })
}


export const create = async (
    req: Request<{}, {}, CreateCommentInput>,
    res: Response
): Promise<void> => {

    /*
        #swagger.tags = ["comments"]
        #swagger.summary = "Create Comment"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
               $ref: "#/definitions/Comment"
            }
        }
    */

    const validatedData = req.body

    const blog = await Blog.findById(validatedData.blogId)

    if (!blog) throw new CustomError("Blog not found", 404)


    const newComment = await Comment.create({
        userId: req.user._id,
        ...validatedData
    })

    blog.comments.push(newComment._id)
    await blog.save()

    res.status(201).send({
        error: false,
        data: newComment
    })
}


export const read = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    /*
        #swagger.tags = ["Comments"]
        #swagger.summary = "Get Single Comment"
    */

       
    const comment = await Comment.findById(req.params.id)

    if (!comment) throw new CustomError('Comment not found', 404)

    if (comment.userId.toString() !== req.user._id.toString())
        throw new CustomError('you can not read someone else comment.')


    res.status(200).send({
        error: false,
        data: comment
    })
}

export const update = async (
    req: Request<{ id: string }, {}, UpdateCommentInput>,
    res: Response
): Promise<void> => {
    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Update Comment"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
               $ref: "#/definitions/Comment"
            }
        }
    */

    const validatedData = req.body

    const comment = await Comment.findById(req.params.id)

    if (!comment) throw new CustomError('Comment not found', 404)

    if (comment.userId.toString() !== req.user._id.toString())
        throw new CustomError('you can not update someone else comment.', 401)


    Object.assign(comment, validatedData)
    await comment.save()

    res.status(200).send({
        error: false,
        data: comment
    })

}


export const deletee = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Delete Comment"
    */

    const comment = await Comment.findById(req.params.id)

    if (!comment) throw new CustomError('Comment not found', 404)

    if (comment.userId.toString() !== req.user._id.toString())
        throw new CustomError("You can not delete someone else's comment.", 401)

    await Comment.findByIdAndDelete(req.params.id)

    await Blog.findByIdAndUpdate(comment.blogId, {
        $pull: { comments: comment._id }
    })


    res.status(200).send({
        error: false,
        message: "Comment deleted successfully."
    })

}