import Joi from "joi";
import { generalFields } from "../../Utils/generalFields.js";

const userValidation = {
  signUp: {
    body: Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      age: Joi.number().min(18).max(100).required(),
      phone: Joi.string().pattern(new RegExp("^[0-9]{11}$")).required(),
      address: Joi.string().required(),
      forgetCode: Joi.string().pattern(new RegExp("^[0-9]{6}$")),
    }),
  },
  signIn: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    }),
  },
  makeAdmin: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
    Headers: generalFields.Headers,
  },
  forgetPassword: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  },
  resetPassword: {
    body: Joi.object({
      password: Joi.string().min(6).required(),
    }),
  },
};
export default userValidation;
