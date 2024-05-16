const listing = require("./models/listings.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    next(new ExpressError(404, error));
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    next(new ExpressError(500, error));
  } else {
    next();
  }
};

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    (req.session.redirectUrl = req.path), "..", req.originalUrl;
    req.flash("error", " you must have log-In");
    res.redirect("/login");
    z;
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existancelisting = await listing.findById(id);

    if (!existancelisting || existancelisting.owner.toString() !== res.locals.currentUser._id.toString()) {
      req.flash("error", "You are not the owner of the listing or the listing does not exist");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (error) {
    console.error("Error checking ownership:", error);
    req.flash("error", "An error occurred while checking ownership");
    res.redirect("/listings");
  }
};



module.exports.isReviewAuthor = async (req , res , next ) => {
  try {
    let { id , reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author.equals(res.locals.currentUser._id)) {
      req.flash("error" , "you are not the author of the review");
      return res.redirect(`/listings/${id}`); // Fix the redirect URL here
    }
    next();
  } catch (error) {
    req.flash("error" , "An error occurred while checking review ownership");
    res.redirect(`/listings/${id}`);
  }
};
