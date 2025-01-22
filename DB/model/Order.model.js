import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Is Reiquired"],
  },
  products: [
    {
      title: {
        type: String,
        required: [true, "Title Is Reiquired"],
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      discount: {
        type: Number,
        default: 0,
      },
      quantity: {
        type: Number,
        required: [true, "Quantity Is Reiquired"],
      },
      price: {
        type: Number,
        required: [true, "Price Is Reiquired"],
      },
      totalPrice: {
        type: Number,
        required: [true, "Total Price Is Reiquired"],
      },
    },
  ],
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  subtotalPrice: {
    type: Number,
    required: [true, "Subtotal Price Is Reiquired"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total Price Is Reiquired"],
  },
  address: {
    type: String,
    required: [true, "Address Is Reiquired"],
  },
  phone: {
    type: String,
    required: [true, "Phone Is Reiquired"],
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card"],
    required: [true, "Payment Method Is Reiquired"],
  },
  paymentStatus: {
    type: String,
    enum: ["placed", "waitPayment", "shipped", "delivered", "cancelled"],
    default: "placed",
  },
  canceledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cancelReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Order = mongoose.model("Order", orderSchema);
