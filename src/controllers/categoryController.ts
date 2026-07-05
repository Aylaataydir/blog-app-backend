
"use strict"

import CustomError from "../helpers/customError.js"
import Category from "../models/Category.js"
import { Request, Response } from 'express'
import type { CategoryInput } from "../validations/category.validation.js"


export const list = async (
    req: Request,
    res: Response
): Promise<void> => {

    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "List Categories"
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

    const data = await res.getModelList(Category)

    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Category),
        data
    })
}

export const create = async (
    req: Request<{}, {}, CategoryInput>,
    res: Response
): Promise<void> => {

    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Create Category"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
               $ref: "#/definitions/Category"
            }
        }
    */

    const validatedData = req.body

    const data = await Category.create(validatedData)

    res.status(201).send({
        error: false,
        data
    })
}

export const read = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Get Single Category"
    */

    const data = await Category.findById(req.params.id)

    if (!data) throw new CustomError('Data not found.', 404);

    res.status(200).send({
        error: false,
        data
    })
}

export const update = async (
    req: Request<{ id: string }, {}, CategoryInput>,
    res: Response
): Promise<void> => {
    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Update Category"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
               $ref: "#/definitions/Category"
            }
        }
    */

    const validatedData = req.body

    const data = await Category.findByIdAndUpdate(req.params.id, validatedData, { runValidators: true, new: true });

    if (!data) throw new CustomError('Update failed, something went wrong', 404)

    res.status(200).send({
        error: false,
        data
    })
}

export const deletee =  async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    /*
        #swagger.tags = ["Categories"]
        #swagger.summary = "Delete Category"
    */

    const data = await Category.findByIdAndDelete(req.params.id);

    if (!data) {
      throw new CustomError(
        'Category not found or already deleted.',
        404
      );
    }

    res.sendStatus(204);
}