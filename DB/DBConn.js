import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/ECommerce")
  .then(console.log("DB Connected Successfully"))
  .catch((err) => console.log(err));
