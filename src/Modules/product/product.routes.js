import { Router } from "express";
import * as product from "./product.controller.js";
import { upload } from "../../MiddleWares/multer.js";
import { validation } from "../../MiddleWares/validation.js";
import { productValidation } from "./product.Validation.js";
import { auth } from "../../MiddleWares/auth.js";
import { reviewRouter } from "../review/review.routes.js";
import { wishlistRouter } from "../wishlist/wishlist.routes.js";

export const productRouter = Router();

// .get(auth("admin"), brand.getAllBrands)
productRouter.use("/:productId/reviews", reviewRouter);
productRouter.use("/:productId/wishlist", wishlistRouter);
productRouter
  .route("/")
  .post(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "coverImages", maxCount: 3 },
    ]),
    validation(productValidation.create),
    auth("admin"),
    product.createProduct
  )
  .get(
    validation(productValidation.get),
    auth(["admin", "user"]),
    product.getAllProducts
  );
productRouter.route("/:id").put(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(productValidation.update),
  auth("admin"),
  product.updateProduct
);

// brandRouter
//   .route("/:id")
//   .put(
//     upload.single("image"),
//     validate(brandValidation.update.body),
//     auth("admin"),
//     brand.updateBrand
//   )
//   .get(auth("admin"), brand.getBrand)
//   .delete(auth("admin"), brand.deleteBrand);
