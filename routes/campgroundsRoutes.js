const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campGround");
const Review = require("../models/review");
const { campgroundSchema } = require("../schemas");
const flash = require("connect-flash");
const campGround = require("../models/campGround");


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





router.get("/", catchAsync(async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds, messages : req.flash('success') })
  } catch (err) {
    next(err);
  }
})
)




router.get("/new", (req, res) => {
  res.render("campgrounds/new");
})

router.post("/", validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campgroud data' , 400 );
  const campground = new Campground(req.body)
  await campground.save();
  req.flash('success', 'Campground Created !');
  res.redirect( `/campgrounds/${campground._id}`);
}))

router.get("/:id", catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  if (!campground) {
    req.flash('error', 'Cannot find campground');
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
}
)

)


router.patch("/:id", validateCampground, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  //res.send(req.body);
  const updatedCampground = await Campground.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
  req.flash("success", 'Successfully updated campground');
  res.redirect(`/campgrounds/${id}`);
}
)



)

router.delete("/:id/", catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'successfully deleted campground')
  res.redirect("/campgrounds/");

})
)



router.get("/:id/edit", catchAsync(async (req, res, next) => {

  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });

}))


module.exports = router;