import { HydratedDocument, Model } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;

    firstName: string;
    lastName: string;

    isActive: boolean;
    isStaff: boolean;
    isAdmin: boolean;
    avatar: string;

    createdAt: Date;
    updatedAt: Date;

    matchPassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser>;    // this bunu ifade ediyor. mongoose dan gelen document objesini

export interface IUserModel extends Model<IUser> {}  // model icindeki methodlar icin yaziyoruz. findByEmail gibi. static methodlar icin.


export interface UserDTO {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

