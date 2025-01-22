import { Router } from "express";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";
import { wishlistValidation } from "./wishlist.Validation.js";
import * as wishlist from "./wishlist.controller.js";

export const wishlistRouter = Router({ mergeParams: true });

// .get(auth("admin"), brand.getAllBrands)
wishlistRouter
  .route("/")
  .get(
    validation(wishlistValidation.get),
    auth(["user", "admin"]),
    wishlist.getWishlist
  )
  .post(
    validation(wishlistValidation.create),
    auth(["user", "admin"]),
    wishlist.createWishlist
  )
  .put(
    validation(wishlistValidation.delete),
    auth(["user", "admin"]),
    wishlist.removeProductFromWishlist
  );
wishlistRouter
  .route("/clear")
  .delete(
    validation(wishlistValidation.clear),
    auth(["user", "admin"]),
    wishlist.clearWishlist
  );
