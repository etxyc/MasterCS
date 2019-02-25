var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    University = require("./models/university"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/master_cs");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

// passport configuration
app.use(require("express-session")({
    secret: "Sarah",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render("welcome");
});

app.get("/universities", function(req,res) {
    University.find({}, function(err, allUniversities) {
        if(err) {
            console.log(err);
        } else {
            res.render("universities/index", {universities: allUniversities});
        }
    });
});

app.post("/universities", function(req, res) {
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

app.get("/universities/new", function(req, res) {
    res.render("universities/new");
});


app.get("/universities/:id", function(req, res) {
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


// ====================
// Comments Routes
// ====================

app.get("/universities/:id/comments/new", isLoggedIn, function(req, res) {
    University.findById(req.params.id, function(err, university) {
        if(err) {
            console.log(err);
            res.redirect("/universities");
        } else {
            res.render("comments/new", {university: university});
        }
    });
});

app.post("/universities/:id/comments", isLoggedIn, function(req, res) {
    University.findById(req.params.id, function(err, university) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    university.comments.push(comment);
                    university.save();
                    res.redirect("/universities/" + university._id);
                }
            });
        }
    });
});


// ====================
// authen route
// ====================
app.get("/register", function(req, res) {
    res.render("register");
});

// sign up logic
app.post("/register", function(req, res) {
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

app.get("/login", function(req, res) {
    res.render("login");
});

// login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/universities",
        failureRedirect: "/login"
    }), function(req, res) {

    }
);

// logout logic
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/universities");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



app.listen(3000, function(){
    console.log("MasterCS Server Started");
});