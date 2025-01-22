import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { AppError } from "../../Utils/ErrorClass.js";
import { Coupon } from "../../../DB/model/coupon.model.js";

// ================================createCoupon================================
export const createCoupon = AsyncErrorHandling(async (req, res, next) => {
  const { code, discount, startDate, endDate } = req.body;
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    return next(new AppError("Coupon Already Exists", 400));
  }

  const coupon = await Coupon.create({
    code,
    discount,
    startDate,
    endDate,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    message: "Coupon Created Successfully",
    coupon,
  });
});

// ================================getAllCoupons================================
export const getAllCoupons = AsyncErrorHandling(async (req, res, next) => {
  const coupons = await Coupon.find({}).populate("createdBy", "name");
  res.status(200).json({
    status: "success",
    message: "Coupons Fetched Successfully",
    coupons,
  });
});

// ================================getCoupon================================
export const getCoupon = AsyncErrorHandling(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    _id: req.params.id,
  });
  if (!coupon) {
    return next(new AppError("Coupon Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Coupon Fetched Successfully",
    coupon,
  });
});
// ================================updateCoupon================================
export const updateCoupon = AsyncErrorHandling(async (req, res, next) => {
  const { id } = req.params;
  const { code, discount, startDate, endDate } = req.body;

  const coupon = await Coupon.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    {
      code,
      discount,
      startDate,
      endDate,
    },
    { new: true }
  );
  if (!coupon) {
    return next(
      new AppError("Coupon Not Found Or You Are Not Authorized", 404)
    );
  }
  res.status(200).json({
    status: "success",
    message: "Coupon Updated Successfully",
    coupon,
  });
});

// ================================deleteCoupon================================
export const deleteCoupon = AsyncErrorHandling(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findOne({ _id: id, createdBy: req.user._id });
  if (!coupon) {
    return next(
      new AppError("Coupon Not Found Or You Are Not Authorized", 404)
    );
  }
  await Coupon.deleteOne({ _id: id });
  res.status(200).json({
    status: "success",
    message: "Coupon Deleted Successfully",
  });
});
