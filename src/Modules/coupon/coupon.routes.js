import { Router } from "express";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";
import { couponValidation } from "./coupon.Validation.js";
import * as coupon from "./coupon.controller.js";

export const couponRouter = Router();

// .get(auth("admin"), brand.getAllBrands)
couponRouter
  .route("/")
  .get(auth("admin"), coupon.getAllCoupons)
  .post(
    validation(couponValidation.create),
    auth(["admin"]),
    coupon.createCoupon
  );

couponRouter
  .route("/:id")
  .put(
    validation(couponValidation.update),
    auth(["admin"]),
    coupon.updateCoupon
  )
  .get(validation(couponValidation.get), auth(["admin"]), coupon.getCoupon)
  .delete(
    validation(couponValidation.delete),
    auth(["admin"]),
    coupon.deleteCoupon
  );
