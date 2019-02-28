var university = require("../models/university");
var Comment = require("../models/comment");

var middlewareObj = {};

//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;