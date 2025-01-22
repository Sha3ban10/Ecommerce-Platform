import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const productValidation = {
  create: {
    body: Joi.object({
      title: Joi.string().min(3).max(50).required(),
      description: Joi.string().min(3).max(500).required(),
      price: Joi.number().min(1).required(),
      stock: Joi.number().min(1).required(),
      category: Joi.string().custom(ValiditionID).required(),
      brand: Joi.string().custom(ValiditionID).required(),
      subcategory: Joi.string().custom(ValiditionID).required(),
      discount: Joi.number().min(1).max(100),
      avgrating: Joi.number().min(1).max(5),
    }),
    files: Joi.object({
      image: Joi.array().items(generalFields.file.required()),
      coverImages: Joi.array().items(generalFields.file.required()),
    }),
    headers: generalFields.Headers.required(),
  },
  get: {
    // params: Joi.object({
    //   id: Joi.string().custom(ValiditionID).required(),
    // }),
  },
  update: {
    body: Joi.object({
      title: Joi.string().min(3).max(50),
      description: Joi.string().min(3).max(500),
      price: Joi.number().min(1),
      stock: Joi.number().min(1),
      category: Joi.string().custom(ValiditionID),
      brand: Joi.string().custom(ValiditionID),
      subcategory: Joi.string().custom(ValiditionID),
      discount: Joi.number().min(1).max(100),
    }),
    files: Joi.object({
      image: Joi.array().items(generalFields.file),
      coverImages: Joi.array().items(generalFields.file),
    }),
    Headers: generalFields.Headers.required(),
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
  },
  delete: Joi.object({
    id: Joi.string().custom(ValiditionID).required(),
  }),
};
