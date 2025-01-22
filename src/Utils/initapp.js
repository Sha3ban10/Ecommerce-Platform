import "../../DB/DBConn.js";
import { auth } from "../MiddleWares/auth.js";
import { brandRouter } from "../Modules/Brand/Brand.routes.js";
import categoryRouter from "../Modules/category/category.routes.js";
import { productRouter } from "../Modules/product/product.routes.js";
import subCategoryRouter from "../Modules/subCategory/subCategory.routes.js";
import userRouter from "../Modules/Auth/auth.routes.js";
import { AppError } from "./ErrorClass.js";
import { couponRouter } from "../Modules/coupon/coupon.routes.js";
import { cartRouter } from "../Modules/Cart/Cart.routes.js";
import { orderRouter } from "../Modules/order/order.routes.js";
import { removeFromCloudinary } from "./removeFromCloudinary.js";
import { removeFromDB } from "./removeFromDB.js";

export const initApp = (app, express) => {
  const port = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.static("uplouds"));

  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/subcategory", subCategoryRouter);
  app.use("/Brand", brandRouter);
  app.use("/product", productRouter);
  app.use("/coupon", couponRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/test", auth("user"));

  app.use("*", (req, res, next) => {
    next(new AppError("invalid path", 404));
  });

  // Global HandlingError
  app.use(
    (err, req, res, next) => {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message, stack: err.stack });
      next();
    },
    removeFromCloudinary,
    removeFromDB
  );
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
