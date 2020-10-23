var express = require("express");
var path = require("path");
var fs = require("fs");
var dbjson = require("./db/db.json");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// notes array
//var noteItems = dbjson;

// routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  
  app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
  });


// display/ "get" saved notes
  app.get("/api/notes", function(req, res) {
    fs.readFile('./db/db.json', 'utf8', function(err,data) {
        if (err){
            throw err;
        }
    });
     res.json(dbjson);
  });

// adding/creating/ "post" new notes
  app.post("/api/notes", function(req, res) {
    
    var newNotes = req.body;

    function addNote(newitem) {
        dbjson.push(newitem);
        for (var i = 0; i < dbjson.length; i++) {
            dbjson[i].id = i;
        }
        return JSON.stringify(dbjson);
    }
    fs.writeFile('./db/db.json', addNote(newNotes), function(err) {
        if (err){
            throw err;
        }
    });

    console.log(newNotes);

  res.json(dbjson);
});

//deleting notes from dbjson
app.delete("/api/notes/:id", function(req, res) {
    var lostNote = req.params.id;

    console.log(lostNote);

    //dbjson.pop(lostNote);
    dbjson.splice(lostNote,1);
   //delete dbjson[i]

    for (var i = 0; i < dbjson.length; i++) {
        dbjson[i].id = i;
    }

    fs.writeFile('./db/db.json', JSON.stringify(dbjson), function(err) {
        if (err){
            throw err;
        }
    });
    res.json(dbjson);
})

// firing up the server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  
