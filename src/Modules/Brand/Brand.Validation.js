import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const brandValidation = {
  create: {
    body: Joi.object({
      name: Joi.string().min(3).max(30).required(),
    }),
    File: generalFields.file.required(),
    Headers: generalFields.Headers.required(),
  },
  get: {
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
    Headers: generalFields.Headers,
  },
  update: {
    body: Joi.object({
      name: Joi.string().min(3).max(30),
      image: Joi.string(),
    }),
    File: generalFields.file.required(),
    Headers: generalFields.Headers.required(),
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
    Headers: generalFields.Headers,
  },
};
