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
})

const CampGroundSchema = new Schema({
  name: String, 
  price: Number,
  description: String,
  location: String,
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
})

CampGroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id : {$in : doc.reviews}
    })
  }
})


module.exports =mongoose.model("Campground", CampGroundSchema);