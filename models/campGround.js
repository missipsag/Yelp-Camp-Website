const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { SchemaType } = require("mongoose");

const ImageSchema = new Schema({
  url : String,
  filename : String,
})
// add the virtual proprety to display a thumbnail in the edit campground template
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload','/upload/w_200');
});

// we set toJSON {virtuals: true} so that virtuals are included in the resulting object campground
// because virtuals are not included in resulting JSON object
const opts = {toJSON: {virtuals: true}};

const CampGroundSchema = new Schema({
  name: String, 
  price: Number,
  description: String,
  location: String,
  geometry : {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates : {
      type: [Number],
      required: true
    }
  },
  image: [ImageSchema],
  author : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    null : false
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review', 
    null : false
  }]
}, opts);

// here we add a virtual in order to access the campground name for our popup 
CampGroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}" style = "text-decoration : none;">${this.name}</a></strong>
 
  `;
})

CampGroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id : {$in : doc.reviews}
    })
  }
})


module.exports =mongoose.model("Campground", CampGroundSchema);