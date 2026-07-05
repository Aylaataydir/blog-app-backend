
import { Schema, model } from "mongoose";
import { ICategory } from "../types/category.types";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export default model<ICategory>(
  "Category",
  categorySchema
);