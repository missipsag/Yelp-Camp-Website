const Campground = require("./models/campGround");
const Review = require("./models/review");
const ExpressError = require("./utilities/ExpressError");
const {campgroundSchema, reviewSchema} = require("./schemas");

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        //store the the url where to resume browsing
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must login/register to perform this action');
        //redirecting to the original Url
        return res.redirect("/campgrounds/auth/login");
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        //saving the return to Url from session into res.locals
        res.locals.returnTo = req.session.returnTo;
    }
    next()
}

const isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if( !campground.author.equals(req.user._id)) {  // check if the currUser is author of this post
        req.flash("error", 'ACTION NOT PERMITTED, NOT AN OWNER');
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
}


const isReviewAuthor = async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if( !review.author.equals(req.user._id)) { // check if the currUser is author of this post
        req.flash("error", 'ACTION NOT PERMITTED, NOT AN OWNER');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    return next();
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join("  \n ");
      next(new ExpressError(msg, 400));
    }
    else {
      next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(", ");
      next(new ExpressError(msg, 400));
    } else {
      next()
    }
}

module.exports = { 
    isAuthor,
    isLoggedIn, 
    storeReturnTo,
    validateCampground,
    validateReview,
    isReviewAuthor,
};