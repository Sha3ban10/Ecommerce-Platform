import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const couponValidation = {
  create: {
    body: Joi.object({
      code: Joi.string().min(3).max(10).required(),
      discount: Joi.number().min(1).max(100).required(),
      startDate: Joi.date().greater(new Date()).required(),
      endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    }),
    Headers: generalFields.Headers,
  },
  get: {
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers,
  },
  update: {
    headers: generalFields.Headers.required(),
    body: Joi.object({
      code: Joi.string().min(3).max(10),
      discount: Joi.number().min(1).max(100),
      startDate: Joi.date().greater(new Date()),
      endDate: Joi.date().greater(Joi.ref("startDate")),
    }).min(1),
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
    headers: generalFields.Headers.required(),
  },
};
