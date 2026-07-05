
import { Schema, model } from "mongoose";
import type { IComment } from "../types/comment.types.js";


const commentSchema = new Schema<IComment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        blogId: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true
        },

        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model<IComment>(
    "Comment",
    commentSchema
);