var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

var io = require('socket.io').listen(app.listen(3000, function() {
	console.log('Express server listening on port 3000');
}));