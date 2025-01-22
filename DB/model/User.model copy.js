import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Is Reiquired"],
    minLength: 3,
    maxLength: 15,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email Is Reiquired"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password Is Reiquired"],
    minLength: 6,
  },
  age: {
    type: Number,
    required: [true, "Age Is Reiquired"],
    min: 18,
    max: 100,
  },
  phone: {
    type: Number,
    required: [true, "Phone Is Reiquired"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Address Is Reiquired"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  confermedEmail: {
    type: Boolean,
    default: false,
  },
  isLogged: {
    type: Boolean,
    default: false,
  },
  forgetCode: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
  },
});

export const User = mongoose.model("User", UserSchema);
