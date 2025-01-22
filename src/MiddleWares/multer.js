import multer from "multer";
import { nanoid } from "nanoid";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../Utils/ErrorClass.js";

cloudinary.config({
  cloud_name: "dmiwgybvp",
  api_key: "797227313254872",
  api_secret: "EwZ1Caa6fu8IXdaVvOxn2uMd898", // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, nanoid(6) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Images Only"), false);
};

export const upload = multer({ storage, fileFilter });
