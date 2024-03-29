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

//requring routes
var commentRoutes    = require("./routes/comments"),
    universityRoutes = require("./routes/universities"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/master_cs");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//seedDB();

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

app.use("/", indexRoutes);
app.use("/universities", universityRoutes);
app.use("/universities/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("MasterCS Server Started");
});
