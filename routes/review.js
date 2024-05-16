const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedin , validateReview, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");


//post route
route.post(
  "/",
  isloggedin,
  validateReview,
  wrapAsync(reviewController.creatReview)
);

//delete review route
route.delete(
  "/:reviewid",
  isloggedin,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview));

module.exports = route;
