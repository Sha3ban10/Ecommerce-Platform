import { AppError } from "../Utils/ErrorClass.js";

const validationMethod = [
  "body",
  "params",
  "query",
  "headers",
  "files",
  "file",
];

export const validation = (Schema) => {
  return (req, res, next) => {
    validationMethod.forEach((key) => {
      if (Schema[key]) {
        const data = Schema[key].validate(req[key], { AbortEarly: false });
        if (data?.error)
          return next(
            new AppError(
              data.error.details.map(({ message }) => message),
              400
            )
          );
      }
    });
    next();
  };
};
