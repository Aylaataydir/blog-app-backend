
import { z } from "zod";

export const createCommentSchema = z.object({
    blogId: z.string(),

    comment: z.string().min(2).max(1000)
});

export type CreateCommentInput =
    z.infer<typeof createCommentSchema>;


export const updateCommentSchema = z.object({
    comment: z.string().min(2).max(1000)
});

export type UpdateCommentInput =
    z.infer<typeof updateCommentSchema>;