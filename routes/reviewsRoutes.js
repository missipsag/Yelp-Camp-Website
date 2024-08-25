const express = require("express");
const router = express.Router({mergeParams : true});
const catchAsync = require("../utilities/catchAsync");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const Campground = require("../models/campGround")



const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    next(new ExpressError(msg, 400));
  } else {
    next()
  }
}


router.post("/", validateReview, catchAsync(async (req, res) => {
  console.log(req.params)
  const camp = await Campground.findById(req.params.id);
  const newReview = await new Review(req.body);
  console.log(camp)
  camp.reviews.push(newReview);
  await newReview.save();
  await camp.save();
  req.flash("success", 'Review added successfully ! ');
  res.redirect(`/campgrounds/${req.params.id}`);
}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", 'Review deleted successfully ! ');
  res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;