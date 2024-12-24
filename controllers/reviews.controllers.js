const Campground = require("../models/campGround");
const Review = require("../models/review");

//create review route
module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const newReview = await new Review(req.body);
    newReview.author = req.user._id;
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash("success", 'Review added successfully ! ');
    res.redirect(`/campgrounds/${req.params.id}`);
}

//delete review route 
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", 'Review deleted successfully ! ');
    res.redirect(`/campgrounds/${id}`);
  
}