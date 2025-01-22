import { nanoid } from "nanoid";
import { AsyncErrorHandling } from "../../Utils/asyncHandler.js";
import { AppError } from "../../Utils/ErrorClass.js";
import cloudinary from "../../MiddleWares/multer.js";
import slugify from "slugify";
import { productModel } from "../../../DB/model/product.model.js";
import { Category } from "../../../DB/model/Category.model.js";
import { Brand } from "../../../DB/model/Brand.model.js";
import { subCategory } from "../../../DB/model/subCategory.model.js";
import { apiFeatures } from "../../Utils/ApiFeatures.js";
// ================================createProduct================================
export const createProduct = AsyncErrorHandling(async (req, res, next) => {
  const {
    title,
    description,
    price,
    stock,
    category,
    brand,
    subcategory,
    discount,
  } = req.body;

  const productExists = await productModel.findOne({
    title,
    createdBy: req.user._id,
  });
  if (productExists) {
    return next(new AppError("Product already exists", 400));
  }
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError("Category not found", 400));
  }
  const brandExists = await Brand.findById(brand);
  if (!brandExists) {
    return next(new AppError("Brand not found", 400));
  }
  const subCategoryExists = await subCategory.findOne({
    _id: subcategory,
    category,
  });
  if (!subCategoryExists) {
    return next(new AppError("SubCategory not found", 400));
  }

  const totalprice = price - (price * (discount || 0)) / 100;

  const customID = nanoid(10);

  if (!req.files) {
    return next(new AppError("Image is required", 400));
  }

  const { secure_url, public_id } = await cloudinary.uploader
    .upload(req.files.image[0].path, {
      folder: `Ecommerce/category/${categoryExists.customID}/subCategory/${subCategoryExists.customID}/product/${customID}`,
    })
    .catch((err) => {
      console.log(err);
    });

  const list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader
      .upload(file.path, {
        folder: `Ecommerce/category/${categoryExists.customID}/subCategory/${subCategoryExists.customID}/product/${customID}/coverImages`,
      })
      .catch((err) => {
        console.log(err);
      });
    list.push({ secure_url, public_id });
  }

  const product = await productModel.create({
    title,
    slug: slugify(title, "-", { lower: true }),
    description,
    price,
    stock,
    category,
    brand,
    subcategory,
    discount,
    totalprice,
    image: { secure_url, public_id },
    customID,
    coverImages: list,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    product,
  });
});

// =================================updateProduct================================
export const updateProduct = AsyncErrorHandling(async (req, res, next) => {
  const {
    title,
    description,
    price,
    stock,
    category,
    brand,
    subcategory,
    discount,
  } = req.body;
  const productId = req.params.id;

  const productExists = await productModel.findOne({
    _id: productId,
    createdBy: req.user._id,
    category,
    brand,
    subcategory,
  });
  if (!productExists) {
    return next(
      new AppError("Product not found or you are not authorized", 400)
    );
  }
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError("Category not found", 400));
  }
  const brandExists = await Brand.findById(brand);
  if (!brandExists) {
    return next(new AppError("Brand not found", 400));
  }
  const subCategoryExists = await subCategory.findOne({
    _id: subcategory,
    category,
  });
  if (!subCategoryExists) {
    return next(new AppError("SubCategory not found", 400));
  }

  if (title) {
    const productExists = await productModel.findOne({
      title,
    });
    if (productExists) {
      return next(new AppError("title already exists", 400));
    }
    productExists.title = title;
    productExists.slug = slugify(title, "-", { lower: true });
  }

  if (description) {
    productExists.description = description;
  }
  if (price && discount) {
    const totalprice = price - (price * discount) / 100;
    productExists.price = price;
    productExists.discount = discount;
    productExists.totalprice = totalprice;
  } else if (price) {
    productExists.price = price;
    productExists.totalprice = price - (price * productExists.discount) / 100;
  } else if (discount) {
    productExists.discount = discount;
    productExists.totalprice =
      productExists.price - (productExists.price * discount) / 100;
  }

  if (stock) {
    productExists.stock = stock;
  }

  if (req.files) {
    if (req.files?.image?.length) {
      await cloudinary.uploader.destroy(productExists.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader
        .upload(req.files.image[0].path, {
          folder: `Ecommerce/category/${categoryExists.customID}/subCategory/${subCategoryExists.customID}/product/${productExists.customID}`,
        })
        .catch((err) => {
          console.log(err);
        });
      productExists.image = { secure_url, public_id };
    }
    if (req.files?.coverImages?.length) {
      const list = [];
      await cloudinary.api.delete_resources_by_prefix(
        `Ecommerce/category/${categoryExists.customID}/subCategory/${subCategoryExists.customID}/product/${productExists.customID}/coverImages`
      );
      for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader
          .upload(file.path, {
            folder: `Ecommerce/category/${categoryExists.customID}/subCategory/${subCategoryExists.customID}/product/${productExists.customID}/coverImages`,
          })
          .catch((err) => {
            console.log(err);
          });
        list.push({ secure_url, public_id });
      }
      productExists.coverImages = list;
    }
  }

  await productExists.save();
  res.status(201).json({
    status: "success",
    productExists,
  });
});
// ================================getProduct================================
// export const getProduct = AsyncErrorHandling(async (req, res, next) => {
//   const product = await productModel.findById(req.params.id);
//   if (!product) {
//     return next(new AppError("Product Not Found", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     product,
//   });
// });

// ================================getAllProducts================================
export const getAllProducts = AsyncErrorHandling(async (req, res, next) => {
  const ApiFeatures = new apiFeatures(productModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .select();

  const products = await ApiFeatures.query;

  res.status(200).json({
    status: "success",
    products,
  });
});
