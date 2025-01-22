import { Router } from "express";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";
import { reviewValidation } from "./review.Validation.js";
import * as review from "./review.controller.js";

export const reviewRouter = Router({ mergeParams: true });

reviewRouter
  .route("/")
  .post(
    validation(reviewValidation.create),
    auth(["user", "admin"]),
    review.createReview
  )
  .get(
    validation(reviewValidation.get),
    auth(["user", "admin"]),
    review.getReviews
  );

reviewRouter
  .route("/:reviewId")
  .delete(
    validation(reviewValidation.remove),
    auth(["user", "admin"]),
    review.removeReview
  )
  .put(
    validation(reviewValidation.update),
    auth(["user", "admin"]),
    review.updateReview
  );
