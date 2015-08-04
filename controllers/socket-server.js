var _ = require('lodash');
var Model = require('../public/models.js');

module.exports = function(state, server) {
  var io = require('socket.io')(server);

  console.log("Socket server on!");

  io.on('connection', function(socket) {
  	console.log("Connection!");

  	socket.on('login', function(user) {
      user.id = socket.id;

  		if (state.addUser(user)) {
        registerLoggedInEvents(io, state, user, socket);

        socket.emit('login-response', { id: user.id, state: state });
        socket.broadcast.emit('login', user);
      } else {
        socket.emit('login-response', null);
      }
  	});
  })
};

// Registers events which a user can do when they are logged in.
var registerLoggedInEvents = function(io, state, user, socket) {
  socket.on('message', function(data) {
    var message = new Model.Message(user, data.text);
    state.addMessage(message);
    io.emit('message', message);
  });

  socket.on('create-listing', function(data) {
    // XXX: Add auction end callback.
    var auctionItem = new Model.AuctionItem(user, data.name, data.imageUrl,
      parseFloat(data.auctionDurationMins),
      function() {
        state.closeAuction(auctionItem.id);
        io.emit('auction-end', { id: auctionItem.id });
      });
    state.addListing(auctionItem);
    io.emit('create-listing', auctionItem);
  });

  socket.on('create-bid', function(data) {
    var bid = new Model.Bid(data.itemId, user, data.price);

    var status = state.addBid(bid);

    if (status === 'OK') {
      io.emit('create-bid', bid);
    } else {
      console.log('error');
      socket.emit('create-bid-error', { message: status });
    }
  });

  socket.on('logout', function() {
    io.emit('logout', user);
  });
}
