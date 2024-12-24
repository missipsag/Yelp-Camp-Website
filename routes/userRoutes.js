const express = require("express");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const {storeReturnTo} = require("../middleware");
const router = express.Router();
const users = require("../controllers/users.controllers")

//login
router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo,
        passport.authenticate('local',{ failureFlash: true, failureRedirect: '/campgrounds/auth/login' }),
        catchAsync(users.login)
    )
    
//register
router.route('/register')
    .get(users.renderRegisterForm)
    .post(storeReturnTo, catchAsync(users.register))

//logout route
router.get("/logout",users.logout);

module.exports = router;