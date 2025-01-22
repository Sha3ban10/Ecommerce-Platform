import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { nanoid } from "nanoid";
import { Category } from "../../../DB/model/Category.model.js";
import { AppError } from "../../Utils/ErrorClass.js";
import slugify from "slugify";
import cloudinary from "../../MiddleWares/multer.js";
import { subCategory } from "../../../DB/model/subCategory.model.js";

// ==================================getAllCategories================================

export const getAllCategories = AsyncErrorHandling(async (req, res, next) => {
  const result = await Category.find().populate([
    { path: "subCategories", select: "name -_id" },
    { path: "createdBy", select: "name -_id" },
  ]);
  res.status(200).json(result);
});
// =================================getCategory================================

export const getCategory = AsyncErrorHandling(async (req, res, next) => {
  const result = await Category.findById(req.params.id).populate([
    { path: "subCategories", select: "name -_id" },
    { path: "createdBy", select: "name -_id" },
  ]);
  if (!result) {
    return next(new AppError("Category not Exists", 400));
  }
  res.status(200).json(result);
});

// =================================createCategory================================

export const createCategory = AsyncErrorHandling(async (req, res, next) => {
  const { name } = req.body;
  const customID = nanoid(6);

  if (!name && !req.file) {
    return next(new AppError("name or image is required", 400));
  }
  const data = await Category.findOne({ name: name.toLowerCase() });
  if (data) {
    return next(new AppError("Category Already Exists", 400));
  }

  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  const { secure_url, public_id } = await cloudinary.uploader
    .upload(req.file.path, {
      folder: `Ecommerce/Category/${customID}`,
    })
    .catch((err) => {
      console.log(err);
    });

  req.filePath = `Ecommerce/Category/${customID}`;
  console.log(req.filePath);

  const result = await Category.create({
    name: name.toLowerCase(),
    slug: slugify(name, "-", { lower: true }),
    createdBy: req.user._id,
    image: { secure_url, public_id },
    customID,
  });

  req.data = {
    model: Category,
    id: result._id,
  };

  res.status(201).json(result);
});

// =================================updateCategory================================
export const updateCategory = AsyncErrorHandling(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const data = await Category.findOne({ _id: id, createdBy: req.user._id });
  if (!data) {
    return next(new AppError("Category Not Found", 400));
  }
  if (name) {
    if (data.name === name.toLowerCase()) {
      return next(new AppError("name Must Be Differnt", 400));
    }
    if (await Category.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("Category Already Exists", 400));
    }
    data.name = name.toLowerCase();
    data.slug = slugify(name, "-", { lower: true });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(data.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader
      .upload(req.file.path, {
        folder: `Ecommerce/Category/${data.customID}`,
      })
      .catch((err) => {
        console.log(err);
      });
    data.image = { secure_url, public_id };
  }

  const result = await data.save();

  res.status(201).json(result);
});

// =================================deleteCategory================================
export const deleteCategory = AsyncErrorHandling(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const category = await Category.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  console.log(category);
  if (!category) {
    return next(new AppError("Category not Exists or you are not owner", 400));
  }

  await subCategory.deleteMany({
    category: category._id,
  });

  await cloudinary.api.delete_resources_by_prefix(
    `Ecommerce/Category/${category.customID}`
  );
  await cloudinary.api.delete_folder(`Ecommerce/Category/${category.customID}`);

  res.status(200).json("category Deleted Successfully");
});
