
import { Schema, model } from "mongoose";
import type { IBlog } from "../types/blog.types.js";


const blogSchema = new Schema<IBlog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            unique:true
        },

        content: {
            type: String,
            required: true
        },

        image: String,

        isPublish: {
            type: Boolean,
            default: false
        },

        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],

        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],

        countOfVisitors: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default model<IBlog>(
    "Blog",
    blogSchema
);