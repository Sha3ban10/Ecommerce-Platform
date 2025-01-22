import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Is Reiquired"],
    minLength: 3,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Is Reiquired"],
  },
  slug: {
    type: String,
    required: [true, "Slug Is Reiquired"],
    unique: true,
    trim: true,
  },
  image: {
    secure_url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  customID: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category Is Reiquired"],
  },
});

export const subCategory = mongoose.model("subCategory", subCategorySchema);
