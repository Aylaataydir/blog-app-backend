
import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const createUserSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    avatar: z.url().nullable().optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;



export const loginSchema = z.object({
    login: z
      .string()
      .trim()
      .min(3, "Email or username must be at least 3 characters long."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
});

export type LoginInput = z.infer<typeof loginSchema>;




export const refreshSchema = z.object({
    refreshToken: z.string()
})

export type RefreshBody = z.infer<typeof refreshSchema>



export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, 'Username must be at least 3 characters')
      .max(50)
      .optional(),

    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .max(50)
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters')
      .max(50)
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine((value) => EMAIL_REGEX.test(value), {
        message: 'Please enter a valid email address',
      })
      .optional(),

    avatar: z.url().optional().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
  });  // req.body tamamen bossa hata verir. yani hicbir alan degismediyse.


  export type UpdateUserInput = z.infer<typeof updateUserSchema>



  // password update

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Current password is required'),

    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
        'Password must contain uppercase, lowercase, number and special character'
      )
  })


  export type ChangePasswordInput = z.infer<typeof changePasswordSchema>