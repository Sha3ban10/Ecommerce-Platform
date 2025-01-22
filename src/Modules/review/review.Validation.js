import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const reviewValidation = {
  get: {
    params: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers,
  },
  create: {
    body: Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().required(),
    }),
    params: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers,
  },
  remove: {
    params: Joi.object({
      reviewId: Joi.string().custom(ValiditionID).required(),
      productId: Joi.string().custom(ValiditionID),
    }),
    headers: generalFields.Headers,
  },
  update: {
    body: Joi.object({
      rating: Joi.number().min(1).max(5),
      comment: Joi.string(),
    }).min(1),
    params: Joi.object({
      reviewId: Joi.string().custom(ValiditionID).required(),
      productId: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers,
  },
};
