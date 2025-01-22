import mongoose from "mongoose";

export const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Is Reiquired"],
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product Is Reiquired"],
    },
  ],
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
