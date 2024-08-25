const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const CampGroundSchema = new Schema({
  name: String, 
  price: Number,
  description: String,
  location: String,
  image: String,
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