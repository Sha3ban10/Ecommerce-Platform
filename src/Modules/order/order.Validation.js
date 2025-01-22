import Joi from "joi";
import { generalFields, ValiditionID } from "../../Utils/generalFields.js";

export const orderValidation = {
  create: {
    body: Joi.object({
      productId: Joi.string().custom(ValiditionID),
      quantity: Joi.number(),
      couponCode: Joi.string(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
      paymentMethod: Joi.string().valid("cash", "card").required(),
    }),
    headers: generalFields.Headers,
  },
  cancel: {
    headers: generalFields.Headers,
    body: Joi.object({
      cancelReason: Joi.string(),
    }),
  },
};
