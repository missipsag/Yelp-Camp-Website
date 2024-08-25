


const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const colors = require("colors");
const Campground = require("./models/campGround");
const methodOverride = require("method-override")
const PORT = 3000;
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");
const catchAsync = require("./utilities/catchAsync"); 
const { campgroundSchema, reviewSchema } = require("./schemas")
const Review = require("./models/review");
const campgrounds = require("./routes/campgroundsRoutes")
const flash = require("connect-flash");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const reviews = require("./routes/reviewsRoutes")

mongoose.connect("mongodb://localhost:27017/yelp-camp");
  
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error : '));
db.once("open", () => {
  console.log("Database connected".blue);
})

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const sessionConfig = {
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7, 
    httpOnly : true
  }
}
app.use(Session(sessionConfig))
// app.use(cookieParser('thisismysecret'))
app.use(flash())
app.use(express.static(path.join(__dirname, './public')))

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash('error')
  next()
})

app.get("/", (req, res) => {
  res.render("home")
})

app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews )




app.all('*', (req, res, next) => {
  next(new ExpressError('PAGE NOT FOUND ', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'SOMETHING WENT WRONG !!'
  }
  res.status(statusCode).render('error', {err});
})


app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`.blue);
})











// ***********************************************************************************

