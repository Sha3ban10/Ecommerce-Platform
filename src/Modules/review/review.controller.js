import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { AppError } from "../../Utils/ErrorClass.js";
import { productModel } from "../../../DB/model/product.model.js";
import { review } from "../../../DB/model/Review.model.js";
import { Order } from "../../../DB/model/order.model.js";

// ================================createReview================================
export const createReview = AsyncErrorHandling(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product Not Found", 404));
  }
  const reviewExist = await review.findOne({
    product: productId,
    createdBy: req.user._id,
  });
  if (reviewExist) {
    return next(new AppError("You Already Reviewed This Product", 400));
  }
  const order = await Order.findOne({
    user: req.user._id,
    "products.productId": productId,
    paymentStatus: "delivered",
  });
  if (!order) {
    return next(new AppError("You Must Buy This Product To Review It", 400));
  }
  const Review = await review.create({
    rating,
    comment,
    createdBy: req.user._id,
    product: productId,
  });

  let sum = product.avgrating * product.numberOfReviews;
  product.reviews.push(Review._id);
  product.numberOfReviews++;
  sum = sum + rating;
  product.avgrating = sum / product.numberOfReviews;
  await product.save();

  res.status(200).json({ message: "Review Created Successfully", Review });
});

// ================================removeReview================================
export const removeReview = AsyncErrorHandling(async (req, res, next) => {
  const { reviewId } = req.params;
  const Review = await review.findOne({
    _id: reviewId,
    createdBy: req.user._id,
  });
  if (!Review) {
    return next(new AppError("Review Not Found", 404));
  }
  await review.deleteOne({ _id: reviewId });

  const product = await productModel.findById(Review.product);
  product.reviews.pull(reviewId);
  let sum = product.avgrating * product.numberOfReviews - Review.rating;
  product.numberOfReviews--;
  product.avgrating = sum / product.numberOfReviews;
  await product.save();

  res.status(200).json({ message: "Review Removed Successfully" });
});

// ================================getReviews================================
export const getReviews = AsyncErrorHandling(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product Not Found", 404));
  }
  const reviews = await review
    .find({ product: req.params.productId })
    .populate("createdBy", "name");
  if (reviews.length === 0) {
    return next(new AppError("No Reviews Found", 404));
  }
  res.status(200).json({ message: "Reviews", reviews });
});

// ================================updateReview================================
export const updateReview = AsyncErrorHandling(async (req, res, next) => {
  const { reviewId, productId } = req.params;
  const { rating, comment } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product Not Found", 404));
  }
  const Review = await review.findOne({
    _id: reviewId,
    createdBy: req.user._id,
    product: productId,
  });
  if (!Review) {
    return next(new AppError("Review Not Found", 404));
  }

  if (Review.rating === rating && Review.comment === comment) {
    return next(new AppError("Rating And Comment are The Same", 400));
  }

  if (rating) {
    Review.rating = rating;
  }
  if (comment) {
    Review.comment = comment;
  }
  await Review.save();
  res.status(200).json({ message: "Review Updated Successfully", Review });
});
