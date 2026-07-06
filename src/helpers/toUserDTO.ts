import { UserDocument, UserDTO } from "../types/user.types.js";

// Function overloads
export function toUserDTO(user: UserDocument): UserDTO;
export function toUserDTO(user: UserDocument[]): UserDTO[];
export function toUserDTO(user: UserDocument | UserDocument[] | null): UserDTO | UserDTO[] | null;

// Implementation
export function toUserDTO(user: UserDocument | UserDocument[] | null): UserDTO | UserDTO[] | null {
    if (!user) return null;

    if (Array.isArray(user)) {
        return user.map(item => toUserDTO(item));
    }

    return {
        _id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}