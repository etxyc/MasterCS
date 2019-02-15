var mongoose = require("mongoose");
var University = require("./models/university");
var Comment = require("./models/comment");

var data = [
    {
        name: "Stanford University", 
        image: "https://media4.s-nbcnews.com/j/newscms/2018_48/2665111/181130-stanford-university-campus-cs-329p_c1947eef13598b42a903e0e8fcdcff3c.fit-760w.jpg", 
        program: "M.S. Computer Science"
    },
    {
        name: "Carnegie Mellon University", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Gates-Hillman_Complex_at_Carnegie_Mellon_University_3.jpg/1200px-Gates-Hillman_Complex_at_Carnegie_Mellon_University_3.jpg", 
        program: "M.S. Computer Science"
    },
    {
        name: "Massachusetts Institute of Technology",
        image: "https://www.mit.edu/files/images/201806/MIT%20Flickr%20Library_1019-346-Photo%20by%20Jake%20Belcher_preview.jpeg", 
        program: "M.S. Computer Science"
    },
    {
        name: "University of California, Berkeley", 
        image: "https://static1.squarespace.com/static/5429a845e4b00d5037c67caa/t/54d2a77ce4b010d05848e596/1423091655758/shutterstock_37660918.jpg?format=1500w", 
        program: "M.S. Computer Science"
    }
];

function seedDB() {
    University.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("removed database");

        data.forEach(function(seed) {
            University.create(seed, function(err, university) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("added a university");


                    Comment.create(
                        {
                            text: "Good Good Good",
                            author: "Stephen"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                university.comments.push(comment);
                                university.save();
                                console.log("created new comment");
                            }
                        }
                    )
                }
            })
        })
    })
}

module.exports = seedDB;