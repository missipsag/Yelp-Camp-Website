const mongoose = require("mongoose");
const Campground = require("./../models/campGround");
const cities = require("./cities");
const {places , descriptors} = require("./seedHelpers");


mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error : '));
db.once("open", () => {
  console.log("Database connected".blue);
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random()* 100) +1 ; 
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      name: `${sample(descriptors)} ${sample(places)}`,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex obcaecati provident ipsam. Necessitatibus quisquam tempore numquam nostrum asperiores sunt optio culpa tenetur natus blanditiis? Inventore, impedit laborum.Nisi, deserunt quia!",
      price , 
      author : '6718ad0acb723ab795c5e900',
      reviews : [],
      image: [
        {
          url: 'https://res.cloudinary.com/dnpz7gsla/image/upload/v1735060459/YelpCamp/hnuulrb9gra6rkll9fv8.jpg',
          filename: 'YelpCamp/hnuulrb9gra6rkll9fv8',
        },
        {
          url: 'https://res.cloudinary.com/dnpz7gsla/image/upload/v1735058975/YelpCamp/d3uciuz5njyv8wfy4xxe.jpg',
          filename: 'YelpCamp/hnuulrb9gra6rkll9fv8',
        }
      ], 
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude ]
      }
    })
    await camp.save();
  }
}



seedDB().then(() => {
  mongoose.connection.close()
});