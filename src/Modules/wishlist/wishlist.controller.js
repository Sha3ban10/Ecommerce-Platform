import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { AppError } from "../../Utils/ErrorClass.js";
import { Wishlist } from "../../../DB/model/Wishlist.model.js";
import { productModel } from "../../../DB/model/product.model.js";

// ================================createWishlist================================
export const createWishlist = AsyncErrorHandling(async (req, res, next) => {
  const { productId } = req.params;
  const productExist = await productModel.findById(productId);
  if (!productExist) {
    return next(new AppError("Product Not Found", 404));
  }
  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  });
  if (!wishlist) {
    const wishlist = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });
    return res
      .status(200)
      .json({ message: "Wishlist Created Successfully", wishlist });
  }
  await Wishlist.updateOne(
    { _id: wishlist._id },
    { $addToSet: { product: productId } },
    { new: true }
  );
  res.status(200).json({ message: "product added to wishlist", wishlist });
});

// ================================removeProductFrom  Wishlist================================
export const removeProductFromWishlist = AsyncErrorHandling(
  async (req, res, next) => {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });
    if (!wishlist) {
      return next(new AppError("Wishlist not found", 404));
    }
    const productExist = wishlist.product.find(
      (product) => product.toString() === productId
    );
    if (!productExist) {
      return next(new AppError("Product not found in wishlist", 404));
    } else {
      wishlist.product = wishlist.product.filter(
        (product) => product.toString() !== productId
      );
    }
    await wishlist.save();
    res
      .status(200)
      .json({ message: "Product Removed From Wishlist", wishlist });
  }
);

// ================================getWishlist================================
export const getWishlist = AsyncErrorHandling(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "product",
    "title price image coverImages"
  );
  if (!wishlist) {
    return next(new AppError("Wishlist Not Found", 404));
  }
  if (wishlist.product.length === 0) {
    return next(new AppError("Wishlist Is Empty", 404));
  }
  const products = wishlist.product.map((product) => product.toObject());
  res.status(200).json({ message: "Wishlist", products: wishlist.product });
});

// ================================ClearWishlist================================
export const clearWishlist = AsyncErrorHandling(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return next(new AppError("Wishlist Not Found", 404));
  }
  if (wishlist.product.length === 0) {
    return next(new AppError("Wishlist Is Empty", 404));
  }
  wishlist.product = [];
  await wishlist.save();
  res.status(200).json({ message: "Wishlist Cleared Successfully" });
});
