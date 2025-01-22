import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

const Categoryvalidation = {
  create: {
    body: Joi.object({
      name: Joi.string().min(3).required(),
    }),
    File: generalFields.file.required(),
    Headers: generalFields.Headers.required(),
  },
  update: {
    file: generalFields.file,
    body: Joi.object({
      name: Joi.string().min(3).required(),
    }),
    headers: generalFields.Headers,
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
  },
  get: {
    headers: generalFields.Headers.required(),
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
    }),
    Headers: generalFields.Headers.required(),
  },
};

export default Categoryvalidation;
