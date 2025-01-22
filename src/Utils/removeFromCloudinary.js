import cloudinary from "../MiddleWares/multer.js";

export const removeFromCloudinary = async (req, res, next) => {
  if (req?.filePath) {
    console.log(req.filePath);
    await cloudinary.api.delete_resources_by_prefix(req.filePath);
    await cloudinary.api.delete_folder(req.filePath);
    next();
  }
};
