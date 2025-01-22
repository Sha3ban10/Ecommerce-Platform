import { Model } from "mongoose";
export const removeFromDB = async (req, res, next) => {
  if (req?.data) {
    const { model, id } = req.data;
    console.log(model, id);

    await model.deleteOne({ _id: id });
  }
};
