const listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.creatReview = async (req, res) => {
    let { id } = req.params;
    let listings = await listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "new review added!");
    res.redirect(`/listings/${id}`);
  }
 
 module.exports.deleteReview = async (req, res) => {
    let { id, reviewid } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "review deleted successfully!");
    res.redirect(`/listings/${id}`);
  } 