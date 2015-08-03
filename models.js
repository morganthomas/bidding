var User = function(id, username) {
  this.id = id;
  this.username = username;
};

var Message = function(user, text) {
  this.user = user;
  this.text = text;
  this.timestamp = new Date();
}

var AuctionItem = function(submitter, name, imageUrl, auctionDurationMins, auctionEndCallback) {
  this.submitter = submitter;
  this.name = name;
  this.imageUrl = imageUrl;
  this.bids = [];
  this.startTime = new Date();
  this.endTime = new Date(this.startTime.value + auctionDurationMins * 1000 * 60);
};

var Bid = function(user, price) {
  this.user = user;
  this.price = price;
  this.timestamp = new Date();
};

var State = function() {
  this.users = [];
  this.messages = [];
  this.auction = [];
}

module.exports = {
  User: User,
  Message: Message,
  AuctionItem: AuctionItem,
  Bid: Bid
};
