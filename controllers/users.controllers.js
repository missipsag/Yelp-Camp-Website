const User = require("../models/user");

//serve the login form 
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

// login route
module.exports.login = async (req, res) => {
    req.flash("success", 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

//render register form 
module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

// register route 
module.exports.register = async (req, res, next) => {
    try {
    const newUser = new User({username : req.body.username});
    const registeredUser = await User.register(newUser , req.body.password);   
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    //login the new user immediately
    req.logIn(registeredUser, err => {
        if (err) return next();
        req.flash("succes", "Welcome to Yelp Camp!");
        res.redirect(`${redirectUrl}`);
    });
    } catch(err) {
     req.flash("error", err.message);
     res.redirect("/campgrounds/auth/register");
    }
}

// logout route 
module.exports.logout =  (req, res)=> {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", 'goodbye!');
        res.redirect('/campgrounds');
    });
}