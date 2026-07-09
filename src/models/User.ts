
import { Schema, model } from "mongoose";


import bcrypt from 'bcrypt';
import type { IUser, IUserModel, UserDocument } from "../types/user.types.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

const userSchema = new Schema<IUser, IUserModel>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value) => EMAIL_REGEX.test(value),
                message: 'Please enter a valid email address',
            },
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
            validate: {
                validator: (value) => PASSWORD_REGEX.test(value),
                message:
                    'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
            },
        },

        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isStaff: {
            type: Boolean,
            default: false
        },

        isAdmin: {
            type: Boolean,
            default: false
        },

        avatar: {
            type: String
        },

        likedBlogs: [{
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }],

        savedBlogs: [{
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }]
    },
    {
        timestamps: true
    }
);



// hash password
userSchema.pre('save', async function (this: UserDocument) {

    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

// compare password
userSchema.methods.matchPassword = async function (this: UserDocument, password: string) {
    if (!password || !this.password) return false;

    return bcrypt.compare(password, this.password)
}



export default model<IUser, IUserModel>("User", userSchema);