import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { AppError } from "../../Utils/ErrorClass.js";
import { Coupon, couponSchema } from "../../../DB/model/coupon.model.js";
import { productModel } from "../../../DB/model/product.model.js";
import { Order } from "../../../DB/model/order.model.js";
import { Cart } from "../../../DB/model/Cart.model.js";
import { createInvoice } from "../../Utils/pdf.js";
import { sendEmail } from "../../Services/SendEmail.js";

// ================================createCoupon================================
export const createOrder = AsyncErrorHandling(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } =
    req.body;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode,
      usedBy: { $ne: req.user._id },
    });
    if (!coupon) {
      return next(new AppError("Coupon Not Found Or Already Used", 404));
    }
    req.body.coupon = coupon;
  }

  let products = [];
  let flag = false;
  let finalproducts = [];
  let finalPrice = 0;
  if (productId) {
    products.push({ productId, quantity });
  } else {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart.products.length) {
      return next(new AppError("Cart Is Empty", 404));
    }
    products = cart.products;
    flag = true;
  }

  for (let product of products) {
    const isProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!isProduct) {
      return next(
        new AppError(
          `Product: ${product.productId} Not Found Or Not Enough Stock`,
          404
        )
      );
    }
    if (flag) {
      product = product.toObject();
    }
    product.title = isProduct.title;
    product.price = isProduct.price;
    product.discount = isProduct.discount;
    product.totalPrice = isProduct.totalprice * product.quantity;
    isProduct.stock -= product.quantity;
    finalPrice += product.totalPrice;

    await isProduct.save();
    finalproducts.push(product);
  }
  const order = await Order.create({
    user: req.user._id,
    products: finalproducts,
    couponId: req.body?.coupon?.code ? req.body.coupon : null,
    subtotalPrice: finalPrice,
    totalPrice:
      finalPrice - finalPrice * ((req.body?.coupon?.discount || 0) / 100),
    address,
    phone,
    paymentMethod,
    paymentStatus: "placed",
  });

  if (flag) {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.products = [];
    await cart.save();
  }
  if (req.body?.coupon?.code) {
    const coupon = await Coupon.findOneAndUpdate(
      { code: req.body.coupon.code },
      { $push: { usedBy: req.user._id } }
    );
  }

  const invoice = {
    shipping: {
      name: req.user.name,
      address: order.address,
      city: "Faypum",
      country: "Egypt",
      postal_code: 94111,
    },
    items: order.products,
    subtotalPrice: order.subtotalPrice,
    totalPrice: order.totalPrice,
    couponDiscount: req.body?.coupon?.discount || 0,
    invoice_nr: order._id,
    date: order.createdAt,
  };

  await createInvoice(invoice, "invoice.pdf");
  await sendEmail(
    req.user.email,
    "Order Placed Successfully",
    `<h1>Order Placed Successfully</h1>`,
    [
      {
        path: "invoice.pdf",
        contentType: "application/pdf",
      },
    ]
  );

  res.status(200).json({ message: "Order Created Successfully", order });
});

// ================================getOrder================================
// export const getOrder = AsyncErrorHandling(async (req, res, next) => {
//   const order = await Order.findOne({ user: req.user._id });
//   res.status(200).json({ message: "Order Fetched Successfully", order });
// });

// ================================cancel order================================
export const cancelOrder = AsyncErrorHandling(async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  const { cancelReason } = req.body;
  if (!order) {
    return next(new AppError("Order Not Found Or Not Belong To You", 404));
  }
  if (
    (order.paymentMethod == "cash" && order.paymentStatus !== "placed") ||
    (order.paymentMethod == "card" && order.paymentStatus !== "waitPayment")
  ) {
    return next(new AppError("order can't be cancelled", 400));
  }
  order.paymentStatus = "cancelled";
  order.cancelReason = cancelReason;
  order.canceledBy = req.user._id;
  await order.save();
  order.products.forEach(async (product) => {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    );
  });
  if (order.couponId) {
    await Coupon.updateMany(
      { _id: { $in: order.couponId } },
      { $pull: { usedBy: req.user._id } }
    );
  }
  res.status(200).json({ message: "Order Cancelled Successfully", order });
});
