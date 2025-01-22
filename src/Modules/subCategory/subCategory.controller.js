import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { nanoid } from "nanoid";
import { AppError } from "../../Utils/ErrorClass.js";
import slugify from "slugify";
import cloudinary from "../../MiddleWares/multer.js";
import { subCategory } from "../../../DB/model/subCategory.model.js";
import { Category } from "../../../DB/model/Category.model.js";

// =================================createsubCategory===============================
export const createSubCategory = AsyncErrorHandling(async (req, res, next) => {
  const { name } = req.body;
  const customID = nanoid(6);
  const dataCategory = await Category.findById(req.params.categoryID);
  if (!dataCategory) {
    return next(new AppError("Category not Exists", 400));
  }
  const data = await subCategory.findOne({
    name: name.toLowerCase(),
    createdBy: req.user._id,
  });
  if (data) {
    return next(new AppError("subCategory Already Exists", 400));
  }

  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  const { secure_url, public_id } = await cloudinary.uploader
    .upload(req.file.path, {
      folder: `Ecommerce/Category/${dataCategory.customID}/subcategory/${customID}`,
    })
    .catch((err) => {
      console.log(err);
    });

  const result = await subCategory.create({
    name: name.toLowerCase(),
    slug: slugify(name, "-", { lower: true }),
    createdBy: req.user._id,
    image: { secure_url, public_id },
    category: req.params.categoryID,
    customID,
  });

  res.status(201).json(result);
});

// ================================getsubCategory================================
export const getSubCategory = AsyncErrorHandling(async (req, res, next) => {
  const { categoryID, id } = req.params;
  if (categoryID) {
    if (id) {
      const data = await subCategory.findOne({ _id: id }).populate([
        { path: "category", select: "name -_id" },
        { path: "createdBy", select: "name -_id" },
      ]);
      if (!data) {
        return next(new AppError("subCategory not Exists", 400));
      }
      res.status(200).json(data);
    }
    const data = await subCategory.find({ category: categoryID }).populate([
      { path: "category", select: "name -_id" },
      { path: "createdBy", select: "name -_id" },
    ]);
    if (!data) {
      return next(new AppError("category not Exists", 400));
    }
    res.status(200).json(data);
  } else {
    if (id) {
      const data = await subCategory.findOne({ _id: id }).populate([
        { path: "category", select: "name -_id" },
        { path: "createdBy", select: "name -_id" },
      ]);
      if (!data) {
        return next(new AppError("subCategory not Exists", 400));
      }
      res.status(200).json(data);
    }
    const data = await subCategory.find().populate([
      { path: "category", select: "name -_id" },
      { path: "createdBy", select: "name -_id" },
    ]);
    res.status(200).json(data);
  }
});
// =================================updatesubCategory================================
export const updateSubCategory = AsyncErrorHandling(async (req, res, next) => {
  const { name } = req.body;
  const { id, categoryID } = req.params;

  if (!name && !req.file) {
    return next(new AppError("name or image is required", 400));
  }
  const data = await subCategory.findOne({
    _id: id,
    category: categoryID,
    createdBy: req.user._id,
  });
  console.log(data);

  if (!data) {
    return next(new AppError("subCategory not Exists", 400));
  }
  if (name) {
    if (data.name === name.toLowerCase()) {
      return next(new AppError("name Must Be Differnt", 400));
    }
    if (await subCategory.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("subCategory Already Exists", 400));
    }
    data.name = name.toLowerCase();
    data.slug = slugify(name, "-", { lower: true });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(data.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader
      .upload(req.file.path, {
        folder: `Ecommerce/Category/subcategory/${customID}`,
      })
      .catch((err) => {
        console.log(err);
      });
    data.image = { secure_url, public_id };
  }

  const result = await data.save();

  res.status(201).json(result);
});

// ================================deletesubCategory================================
export const deleteSubCategory = AsyncErrorHandling(async (req, res, next) => {
  const { id, categoryID } = req.params;
  const data = await subCategory.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
    category: categoryID,
  });

  if (!data) {
    return next(
      new AppError(
        "subCategory or category not Exists or not created by you",
        400
      )
    );
  }
  const dataCategory = await Category.findOne({ _id: categoryID });

  await cloudinary.api.delete_resources_by_prefix(
    `Ecommerce/Category/${dataCategory.customID}/subcategory/${data.customID}`
  );
  await cloudinary.api.delete_folder(
    `Ecommerce/Category/${dataCategory.customID}/subcategory/${data.customID}`
  );
  res.status(200).json({ message: "subCategory Deleted Successfully" });
});
