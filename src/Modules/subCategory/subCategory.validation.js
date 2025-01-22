import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

const subCategoryValidation = {
  create: {
    body: Joi.object({
      name: Joi.string().min(3).required(),
    }),
    File: generalFields.file.required(),
    Headers: generalFields.Headers.required(),
    params: Joi.object({
      CategoryID: Joi.string().custom(ValiditionID).required(),
    }),
  },
  update: {
    body: Joi.object({
      name: Joi.string().min(3),
    }),
    File: generalFields.file,
    Headers: generalFields.Headers,
    params: Joi.object({
      id: Joi.string().custom(ValiditionID).required(),
      CategoryID: Joi.string().custom(ValiditionID).required(),
    }),
  },
};

export default subCategoryValidation;
