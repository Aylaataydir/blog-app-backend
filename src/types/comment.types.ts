
import { Types, HydratedDocument } from "mongoose";

export interface IComment {
    userId: Types.ObjectId;

    blogId: Types.ObjectId;

    comment: string;
}

export type CommentDocument =
    HydratedDocument<IComment>;