const express = require("express");
const router = express.Router({mergeParams : true});
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews.controllers");

// create a review
router.post("/", isLoggedIn,  validateReview, catchAsync(reviews.createReview));

//delete a review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;