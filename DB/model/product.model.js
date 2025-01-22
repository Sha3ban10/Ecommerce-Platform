import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: 3,
    maxLength: 500,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 1,
    max: 1000000,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
    required: [true, "subCategory is required"],
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand is required"],
  },
  image: {
    secure_url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  coverImages: [
    {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  ],

  discount: {
    type: Number,
    min: 1,
    max: 100,
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: 0,
    max: 10000,
  },
  customID: {
    type: String,
  },
  avgrating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalprice: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "CreatedBy is required"],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  numberOfReviews: {
    type: Number,
    default: 0,
  },
});

export const productModel = mongoose.model("Product", productSchema);
