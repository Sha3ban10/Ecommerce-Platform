import { Router } from "express";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";
import * as order from "./order.controller.js";
import { orderValidation } from "./order.Validation.js";

export const orderRouter = Router();

// .get(auth("admin"), brand.getAllBrands)
orderRouter
  .route("/")
  .post(
    validation(orderValidation.create),
    auth(["user", "admin"]),
    order.createOrder
  );

orderRouter.put(
  "/cancel/:orderId",
  validation(orderValidation.cancel),
  auth(["user", "admin"]),
  order.cancelOrder
);
