import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const wishlistValidation = {
  get: {
    headers: generalFields.Headers,
  },
  create: {
    params: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers,
  },
  delete: {
    params: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers,
  },
  clear: {
    headers: generalFields.Headers,
  },
};
