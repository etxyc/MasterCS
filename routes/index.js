var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var University = require("../models/university");


// root route
router.get("/", function(req,res) {
    University.find({}, function(err, allUniversities) {
        if(err) {
            console.log(err);
        } else {
            res.render("universities/index", {universities: allUniversities});
        }
    });
});


// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/universities");
        });
    });
});


// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/universities",
        failureRedirect: "/login"
    }), function(req, res) {

    }
);

// logout logic
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/universities");
});

module.exports = router;
