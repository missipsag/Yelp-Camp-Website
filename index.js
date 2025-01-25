// if not in production, require environment variables
if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const colors = require("colors");
const Campground = require("./models/campGround");
const methodOverride = require("method-override");
const PORT = 3000;
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");
const catchAsync = require("./utilities/catchAsync"); 
const { campgroundSchema, reviewSchema } = require("./schemas");
const Review = require("./models/review");
const campgrounds = require("./routes/campgroundsRoutes");
const flash = require("connect-flash");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const reviews = require("./routes/reviewsRoutes");
const User = require("./models/user");
const users = require("./routes/userRoutes");
const passport = require("passport");
const LocalStrategy = require("passport-local");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
  
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error : '));
db.once("open", () => {
  console.log("Database connected".blue);
})

const app = express();

const sessionConfig = {
  resave : false, 
  saveUninitialized : false,
  secret : 'thisshouldbeabettersecret',
  cookie : {
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7,  
    maxAge : 1000 * 60 * 60 * 24 * 7, 
    httpOnly : true
   }  
};


app.use(passport.initialize());
//use Session before passport.session
app.use(Session(sessionConfig));
app.use(passport.session());
//authenticate is a method added by passport on our User model
passport.use(new LocalStrategy(User.authenticate()));
//serialize user : how to store the user into the session
passport.serializeUser(User.serializeUser()); 
//deserialize user : how to get the user out of the session
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(Session(sessionConfig));
app.use(flash());
app.use(express.static(path.join(__dirname, './public')));
app.use((req, res, next) => {
  res.locals.returnTo = req.session.returnTo;
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash('error');
  next();
})

//routes 
app.get("/", (req, res) => {
  res.render("home");
})

//campground routes
app.use("/campgrounds", campgrounds);
//user routes
app.use("/campgrounds/auth", users );
//review routes
app.use("/campgrounds/:id/reviews", reviews );

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


