import mongoose from "mongoose";

export const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Code Is Reiquired"],
    minLength: 3,
    maxLength: 10,
    unique: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: [true, "Discount Is Reiquired"],
    min: 1,
    max: 100,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Is Reiquired"],
  },
  startDate: {
    type: Date,
    required: [true, "Start Date Is Reiquired"],
  },
  endDate: {
    type: Date,
    required: [true, "End Date Is Reiquired"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Coupon = mongoose.model("Coupon", couponSchema);
