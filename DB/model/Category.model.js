import mongoose from "mongoose";

// const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

export const CategorySchema = new mongoose.Schema(
  {
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
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CategorySchema.virtual("subCategories", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "category",
});

export const Category = mongoose.model("Category", CategorySchema);
