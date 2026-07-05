
import { z } from "zod";

export const createBlogSchema = z.object({
    categoryId: z.string(),

    title: z.string().min(5).max(150),

    content: z.string().min(30),

    image: z.string().optional(),
});

export type CreateBlogInput =
    z.infer<typeof createBlogSchema>;

    

export const updateBlogSchema = z.object({
    categoryId: z.string().optional(),
    title: z.string().min(5).max(150).optional(),
    content: z.string().min(30).optional(),
    image: z.string().optional(),
}).refine(
    (data) => Object.values(data).some(value => value !== undefined),
    { message: "At least one field must be provided" }
)

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>