import { Router } from "express";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";
import * as cart from "./Cart.controller.js";
import { cartValidation } from "./Cart.Validation.js";

export const cartRouter = Router();

cartRouter
  .route("/")
  .post(
    validation(cartValidation.create),
    auth(["user", "admin"]),
    cart.createCart
  )
  .put(
    validation(cartValidation.removeProduct),
    auth(["user", "admin"]),
    cart.removeProductFromCart
  );

cartRouter.put(
  "/clear",
  validation(cartValidation.clear),
  auth(["user", "admin"]),
  cart.clearCart
);
