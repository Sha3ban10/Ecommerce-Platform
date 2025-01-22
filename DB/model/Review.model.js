import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, "Rating Is Reiquired"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, "Comment Is Reiquired"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Is Reiquired"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product Is Reiquired"],
  },
});

export const review = mongoose.model("review", reviewSchema);
