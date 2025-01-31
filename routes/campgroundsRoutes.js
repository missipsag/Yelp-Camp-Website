const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds.controllers");
const multer = require("multer");
const {storage, cloudinary} = require("../cloudinary/cloundinary.config");
const upload = multer({storage});  // destination for image uploads on cloudinary
const fs = require("fs");

router.route("/")
    .get( catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'),  validateCampground, catchAsync(campgrounds.createCampground));
    
// serve the new-Campground form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync( campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//serve the edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;