var express = require("express");
var router  = express.Router({mergeParams: true});
var University = require("../models/university");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// New
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
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

module.exports = router;