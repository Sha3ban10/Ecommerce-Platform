import Joi from "joi";
import mongoose from "mongoose";

export const ValiditionID = (id, helper) => {
  return mongoose.Types.ObjectId.isValid(id)
    ? true
    : helper.message("Invalid ID");
};

export const generalFields = {
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    mimetype: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    destination: Joi.string().required(),
    fieldname: Joi.string().required(),
  }),
  Headers: Joi.object({
    "content-type": Joi.string(),
    "cache-control": Joi.string(),
    "postman-token": Joi.string(),
    "user-agent": Joi.string(),
    "content-length": Joi.string(),
    accept: Joi.string().required(),
    "accept-encoding": Joi.string(),
    "accept-language": Joi.string(),
    connection: Joi.string().required(),
    host: Joi.string().required(),
    origin: Joi.string(),
    token: Joi.string().required(),
  }),
  params: Joi.object({
    id: Joi.string().custom(ValiditionID).required(),
  }),
};
