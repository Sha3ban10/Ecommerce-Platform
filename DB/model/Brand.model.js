import mongoose from "mongoose";

export const brandSchema = new mongoose.Schema({
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
    required: [true, "Custom ID Is Reiquired"],
  },
});

export const Brand = mongoose.model("Brand", brandSchema);
