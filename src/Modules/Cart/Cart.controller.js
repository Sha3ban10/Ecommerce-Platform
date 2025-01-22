import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { AppError } from "../../Utils/ErrorClass.js";
import { Cart } from "../../../DB/model/Cart.model.js";
import { productModel } from "../../../DB/model/product.model.js";

// ======================Create Cart======================
export const createCart = AsyncErrorHandling(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const productExist = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!productExist) {
    return next(new AppError("Product Not Found Or Not Enough Stock", 404));
  }
  const cartExist = await Cart.findOne({ user: req.user._id });
  if (cartExist) {
    const productExist = cartExist.products.find(
      (product) => product.productId == productId
    );
    if (productExist) {
      productExist.quantity = quantity;
    } else {
      cartExist.products.push({ productId, quantity });
    }
    await cartExist.save();
    res.status(200).json({
      status: "success",
      message: "product added to cart successfully",
      cart: cartExist,
    });
  } else {
    const newCart = await Cart.create({
      user: req.user._id,
      products: [{ productId, quantity }],
    });
    res.status(200).json({
      status: "success",
      message: "product added to cart successfully",
      cart: newCart,
    });
  }
});

// ================================Remove Product From Cart===============================
export const removeProductFromCart = AsyncErrorHandling(
  async (req, res, next) => {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new AppError("Cart Not Found", 404));
    }
    const productExist = cart.products.find(
      (product) => product.productId == productId
    );
    if (!productExist) {
      return next(new AppError("Product Not Found In Cart", 404));
    } else {
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId
      );
    }
    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product Removed From Cart Successfully",
      cart,
    });
  }
);

// ================================Get Cart===============================
// export const getCart = AsyncErrorHandling(async (req, res, next) => {
//   const cart = await Cart.findOne({ user: req.user._id });
//   res.status(200).json({
//     status: "success",
//     cart,
//   });
// });

// ================================Clear Cart===============================
export const clearCart = AsyncErrorHandling(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart Not Found", 404));
  }
  if (cart.products.length === 0) {
    return next(new AppError("Cart Is Empty", 404));
  }
  cart.products = [];
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Cart Cleared Successfully",
    cart,
  });
});
