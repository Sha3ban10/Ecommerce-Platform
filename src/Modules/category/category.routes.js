import { Router } from "express";
import * as category from "./category.controller.js";
import { upload } from "../../MiddleWares/multer.js";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import Categoryvalidation from "./category.validation.js";

export const categoryRouter = Router();

categoryRouter.use("/:categoryID/subcategory", subCategoryRouter);

categoryRouter
  .route("/")
  .get(auth("admin"), category.getAllCategories)
  .post(
    upload.single("image"),
    validation(Categoryvalidation.create),
    auth("admin"),
    category.createCategory
  );

categoryRouter
  .route("/:id")
  .get(validation(Categoryvalidation.get), auth("admin"), category.getCategory)
  .put(
    upload.single("image"),
    validation(Categoryvalidation.update),
    auth("admin"),
    category.updateCategory
  )
  .delete(
    validation(Categoryvalidation.delete),
    auth("admin"),
    category.deleteCategory
  );

export default categoryRouter;
