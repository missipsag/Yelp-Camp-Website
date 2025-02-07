const Campground = require("../models/campGround");
const {cloudinary} = require("../cloudinary/cloundinary.config");

// landing page route
module.exports.index = async (req, res, next) => {
    try {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", { campgrounds, messages: req.flash('success') });
    } catch (err) {
      next(err);
    }
}  

//render the create campground form
module.exports.renderNewForm =  (req, res) => {
    res.render("campgrounds/new");
}

//create campground route
module.exports.createCampground = async (req, res) => {
  const campground = new Campground(req.body);
  campground.image = req.files.map( f => ({url : f.path, filename : f.filename})); // map over the req.files and store the filename and path on campground.image
  campground.author = req.user._id;
  await campground.save();
  console.log(req.body, req.file)
  console.log(campground);
  req.flash('success', 'Campground Created !');
  res.redirect(`/campgrounds/${campground._id}`);
}

//render the show page
module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path :'reviews', populate : { path : 'author'}}).populate('author');
    if (!campground) {
      req.flash('error', 'Cannot find campground');
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

// serve the edit form
module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}

// edit route
module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findById(id); // find the campground first, this way will protect our data in the backend
    // check if the campground exists
    if(!updatedCampground) {
      req.flash("error", "CANNOT FIND CAMPGROUND");
      return res.redirect("/campgrounds");
    }

    // if the currUser is the author
    await Campground.findOneAndUpdate({_id : id}, req.body); 

    const imgs = req.files.map( f => ({url : f.path, filename : f.filename}));
    // because req.files.map returns an array, we have to store it in a variable so we can use the spread opearator 
    updatedCampground.image.push(...imgs);

    if(req.body.deleteImages){ 
      //here we delete the images in cloudinary
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
      }
      // here we delete images from our database
      await updatedCampground.updateOne({ $pull: {image: {filename: {$in : req.body.deleteImages}}}});
    }

    await updatedCampground.save();
    req.flash("success", 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}

// delete route
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground')
    res.redirect("/campgrounds/");
}