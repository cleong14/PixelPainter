var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pixel-painter');

var paintingSchema = mongoose.Schema({ painting: Object });
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
  res.render('canvas', {x: 3, y: 3, a: 5, b: 5});
});

app.post('/save', function (req, res) {
  var newPainting = new Painting({ painting: req.body.painting });
  newPainting.save(function () {
    res.send('yay');
  });
});


app.get('/paintings/:id', function(req, res) {
  var id = req.params.id;

  Painting.findOne({ _id: id })
  .then(function (result) {

    var grid = {};

    // for every key thats in result.painting object
    for (key in result.painting) {
      // Object.assign basically is taking the grid object and assigning the values from result.painting
      Object.assign(grid, result.painting[key]);
    }
    res.render('painting', {x: 3, y: 3, a: 5, b: 5, result: grid});
  });
});

app.get('/paintings', function (req, res) {
  Painting.find()
  .then(function (paintings) {
    res.render('listing', { paintings: paintings });
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