import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const cartValidation = {
  create: {
    headers: generalFields.Headers.required(),
    body: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
      quantity: Joi.number().min(1).max(10000).required(),
    }),
  },
  // get: {
  //   params: Joi.object({
  //     id: Joi.string().custom(ValiditionID).required(),
  //   }),
  //   Headers: generalFields.Headers,
  // },
  update: {
    body: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
      quantity: Joi.number().min(1).max(10000).required(),
    }),
    headers: generalFields.Headers.required(),
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
  },
  removeProduct: {
    body: Joi.object({
      productId: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers.required(),
  },
  clear: {
    headers: generalFields.Headers.required(),
  },
  // delete: {
  //   params: Joi.object({
  //     id: Joi.string().custom(ValiditionID).required(),
  //   }),
  //   Headers: generalFields.Headers,
  // },
};
