import { nanoid } from "nanoid";
import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { Brand } from "../../../DB/model/Brand.model.js";
import { AppError } from "../../Utils/ErrorClass.js";
import cloudinary from "../../MiddleWares/multer.js";
import slugify from "slugify";

// ==================================getAllBrands================================

export const getAllBrands = AsyncErrorHandling(async (req, res, next) => {
  const result = await Brand.find().populate([
    { path: "createdBy", select: "name -_id" },
  ]);
  res.status(200).json(result);
});
// ================================getBrand================================

export const getBrand = AsyncErrorHandling(async (req, res, next) => {
  const result = await Brand.findById(req.params.id).populate([
    { path: "createdBy", select: "name -_id" },
  ]);
  if (!result) {
    return next(new AppError("Brand not Exists", 400));
  }
  res.status(200).json(result);
});
// ================================createBrand================================
export const createBrand = AsyncErrorHandling(async (req, res, next) => {
  const { name } = req.body;
  const customID = nanoid(6);
  const data = await Brand.findOne({ name: name.toLowerCase() });
  if (data) {
    return next(new AppError("Brand Already Exists", 400));
  }
  if (!req.file) {
    return next(new AppError("image is required", 400));
  }

  const { secure_url, public_id } = await cloudinary.uploader
    .upload(req.file.path, {
      folder: `Ecommerce/Brand/${customID}`,
    })
    .catch((err) => {
      console.log(err);
    });

  const result = await Brand.create({
    name: name.toLowerCase(),
    slug: slugify(name, "-", { lower: true }),
    createdBy: req.user._id,
    image: { secure_url, public_id },
    customID,
  });
  res.status(201).json({
    status: "success",
    result,
  });
});

// =================================updateBrand================================
export const updateBrand = AsyncErrorHandling(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name && !req.file) {
    return next(new AppError("name or image is required", 400));
  }
  const data = await Brand.findOne({ _id: id, createdBy: req.user._id });
  if (name) {
    if (data.name === name.toLowerCase()) {
      return next(new AppError("name Must Be Differnt", 400));
    }
    if (await Brand.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("Brand Already Exists", 400));
    }
    data.name = name.toLowerCase();
    data.slug = slugify(name, "-", { lower: true });
  }
  if (req.file) {
    await cloudinary.uploader.destroy(data.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader
      .upload(req.file.path, {
        folder: `Ecommerce/Brand/${data.customID}`,
      })
      .catch((err) => {
        console.log(err);
      });
    data.image = { secure_url, public_id };
  }
  const result = await data.save();
  res.status(201).json({
    status: "success",
    result,
  });
});

// ================================deleteBrand================================
export const deleteBrand = AsyncErrorHandling(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!brand) {
    return next(new AppError("Brand not Exists or you are not owner", 400));
  }
  await cloudinary.api.delete_resources_by_prefix(
    `Ecommerce/Brand/${brand.customID}`
  );
  await cloudinary.api.delete_folder(`Ecommerce/Brand/${brand.customID}`);
  res.status(200).json("brand Deleted Successfully");
});
