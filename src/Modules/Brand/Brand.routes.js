import { Router } from "express";
import * as brand from "./Brand.controller.js";
import { upload } from "../../MiddleWares/multer.js";
import { validation } from "../../MiddleWares/validation.js";
import { brandValidation } from "./Brand.Validation.js";
import { auth } from "../../MiddleWares/auth.js";

export const brandRouter = Router();

brandRouter
  .route("/")
  .get(auth("admin"), brand.getAllBrands)
  .post(
    upload.single("image"),
    validation(brandValidation.create),
    auth("admin"),
    brand.createBrand
  );

brandRouter
  .route("/:id")
  .put(
    upload.single("image"),
    validation(brandValidation.update),
    auth("admin"),
    brand.updateBrand
  )
  .get(validation(brandValidation.get), auth("admin"), brand.getBrand)
  .delete(validation(brandValidation.delete), auth("admin"), brand.deleteBrand);
