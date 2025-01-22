import { User } from "../../DB/model/User.model.js";
import { AppError } from "../Utils/ErrorClass.js";
import jwt from "jsonwebtoken";

export const auth =
  (roles = []) =>
  async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return next(new AppError("please signin", 401));
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return next(new AppError("Invalid token or expired", 498));
      const user = await User.findOne({ email: decoded.email });
      if (!user) return next(new AppError("user not found", 404));
      if (user.passwordChangedAt) {
        if (decoded.iat < parseInt(user.passwordChangedAt.getTime() / 1000)) {
          return next(new AppError("Expired token please login again", 498));
        }
      }
      if (roles.length > 0) {
        if (!roles.includes(user.role))
          return next(new AppError("you don't heave prevliges ", 498));
      }
      req.user = user;
      next();
    });
  };
