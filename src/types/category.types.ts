
import { HydratedDocument } from "mongoose";

export interface ICategory {
    name: string;
}

export type CategoryDocument =
    HydratedDocument<ICategory>;