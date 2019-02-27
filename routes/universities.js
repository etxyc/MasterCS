var express = require("express");
var router  = express.Router();
var University = require("../models/university");

// Index
router.get("/", function(req,res) {
    University.find({}, function(err, allUniversities) {
        if(err) {
            console.log(err);
        } else {
            res.render("universities/index", {universities: allUniversities});
        }
    });
});

// Create
router.post("/", function(req, res) {
    // get data from for and add to universities array
    var name = req.body.name;
    var image = req.body.image;
    var program = req.body.program;
    var newUniversity = {name: name, image: image}

    University.create(newUniversity, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to universities page
            res.redirect("/universities");
        }
    });
});


// New
router.get("/new", function(req, res) {
    res.render("universities/new");
});

// Show
router.get("/:id", function(req, res) {
    console.log(req.params);
    University.findById(req.params.id).populate("comments").exec(function(err, foundUniversity) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundUniversity);
            res.render("universities/show", {university: foundUniversity});
        }
    });
});

module.exports = router;