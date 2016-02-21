var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var gridSetup = require('./grid-setup');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pixel-painter');

var paintingSchema = mongoose.Schema({ "painting": Object, "author": String, "description": String });
var Painting = mongoose.model('Painting', paintingSchema);

var app = express();
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.set('view engine', 'jade');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('canvas');
});

app.get('/canvas',  function (req, res) {
  res.render('canvas', {x: gridSetup.colorGrid.width, y: gridSetup.colorGrid.height, a: gridSetup.paintGrid.width, b: gridSetup.paintGrid.height});
});

app.post('/save', function (req, res) {
  var newPainting = new Painting({ "painting": req.body.painting, "author": req.body.author, "description": req.body.description });
  newPainting.save(function () {
    res.send('yay');
  });
});


app.get('/paintings/:id', function(req, res) {
  var id = req.params.id;

  Painting.findOne({ _id: id })
  .then(function (result) {
    console.log(result.description);
    var grid = {};

    // for every key thats in result.painting object
    for (key in result.painting) {
      // Object.assign basically is taking the grid object and assigning the values from result.painting
      Object.assign(grid, result.painting[key]);
    }
    res.render('painting', {x: gridSetup.colorGrid.width, y: gridSetup.colorGrid.height, a: gridSetup.paintGrid.width, b: gridSetup.paintGrid.height, result: grid, author: result.author, description: result.description});
  });
});

app.get('/paintings', function (req, res) {
  Painting.find({})
  .then(function (results) {
    var allPaintings = [];

    for (var i = 0; i < results.length; i++) {
      var grid = {};
      var currentPainting = {
        "canvas": results[i].painting,
        "canvasId": results[i]._id
      };

      for(key in currentPainting) {
        Object.assign(grid, currentPainting[key]);
      }
      allPaintings.push(currentPainting);
    }

    // console.log(allPaintings);
    res.render('listing', { a: gridSetup.paintGrid.width, b: gridSetup.paintGrid.height, results: allPaintings });
  });
});

app.post('/paintings', function (req, res) {
  var newPainting = new Painting({name: req.body.name});
  newPainting.save();
  res.send('Painting saved!');
});

app.put('/paintings/:id', function (req, res) {

});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function () {
  var server = app.listen(3000, function() {
    console.log('Listening to port', server.address().port);
  });
});

module.exports = app;