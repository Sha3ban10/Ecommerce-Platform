import { Router } from "express";
import { upload } from "../../MiddleWares/multer.js";
import * as subCategory from "./subCategory.controller.js";
import { validation } from "../../MiddleWares/validation.js";
import subCategoryValidation from "./subCategory.validation.js";
import { auth } from "../../MiddleWares/auth.js";

export const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .get(auth("admin"), subCategory.getSubCategory)
  .post(
    upload.single("image"),
    validation(subCategoryValidation.create.body),
    auth("admin"),
    subCategory.createSubCategory
  );

subCategoryRouter
  .route("/:id")
  .get(auth("admin"), subCategory.getSubCategory)
  .put(
    upload.single("image"),
    validation(subCategoryValidation.update.body),
    auth("admin"),
    subCategory.updateSubCategory
  )
  .delete(auth("admin"), subCategory.deleteSubCategory);

export default subCategoryRouter;
