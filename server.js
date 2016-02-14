var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pixel-painter');

var drawingSchema = mongoose.Schema({ painting: Object });
var Drawing = mongoose.model('Drawing', drawingSchema);

var app = express();
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/save', function (req, res) {
  var newDrawing = new Drawing({ painting: req.body.painting });
  newDrawing.save(function () {
    res.send('yay');
  });
});

app.get('/drawings/:id', function(req, res) {

});

app.post('/drawings', function (req, res) {
  var newDrawing = new Drawing({name: req.body.name});
  newDrawing.save();
  res.send('Painting saved!');
});

app.put('/drawings/:id', function (req, res) {

});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function () {
  var server = app.listen(3000, function() {
    console.log('Listening to port', server.address().port);
  });
});
