var express = require("express");
var router  = express.Router({mergeParams: true});
var University = require("../models/university");
var Comment = require("../models/comment");

// New
router.get("/new", isLoggedIn, function(req, res) {
    University.findById(req.params.id, function(err, university) {
        if(err) {
            console.log(err);
            res.redirect("/universities");
        } else {
            res.render("comments/new", {university: university});
        }
    });
});

// Create
router.post("/", isLoggedIn, function(req, res) {
    University.findById(req.params.id, function(err, university) {
        if(err) {
            console.log(err);
            res.redirect("/universities")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    university.comments.push(comment);
                    university.save();
                    res.redirect("/universities/" + university._id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;