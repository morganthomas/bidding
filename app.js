var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var Model = require('./public/models.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

var state = new Model.State();

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});

require('./controllers/socket-server.js')(state, server);