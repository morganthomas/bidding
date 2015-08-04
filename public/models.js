var User = function(id, username) {
  this.id = id;
  this.username = username;
};

var Message = function(user, text) {
  this.user = user;
  this.text = text;
  this.timestamp = new Date();
}

var nextAuctionItemId = 0;

// The auctionEndCallback runs when the auction is over. It is optional.
// The frontend probably shouldn't use this argument, because the server decides
// when an auction is over and sends an auction-end event to signal this.
var AuctionItem = function(submitter, name, imageUrl, auctionDurationMins, auctionEndCallback) {
  this.id = nextAuctionItemId++;
  this.submitter = submitter;
  this.name = name;
  this.imageUrl = imageUrl;
  // Status is either 'open' or 'closed'.
  this.status = 'open';
  this.bids = [];
  this.startTime = new Date();

  var auctionDurationMs = auctionDurationMins * 1000 * 60;

  this.endTime = new Date();
  this.endTime.setTime(this.startTime.valueOf() + auctionDurationMs);

  if (auctionEndCallback) {
    setTimeout(auctionEndCallback, auctionDurationMs);
  }
};

var Bid = function(itemId, user, price) {
  this.itemId = itemId;
  this.user = user;
  this.price = price;
  this.timestamp = new Date();
};

var MIN_BID_INCREASE_COEF = 1.25;

// Says whether the given bid on the given auction item is high enough to be admissible.
var bidIsHighEnough = function(item, bid) {
  if (item.bids.length === 0) {
    return true;
  } else {
    return bid.price >= MIN_BID_INCREASE_COEF * item.bids[0].price;
  }
}

var State = function() {
  this.users = [];
  this.messages = [];
  this.auction = [];
}

// Functions for updating a state, corresponding to actions that can occur in the UI.

// Returns true if the action succeeded. (It only fails if the username was not unique.)
// The client side need not check the return value because it is guaranteed to succeed.
State.prototype.addUser = function(user) {
  var duplicateUsers = this.users.filter(function(otherUser) {
    return otherUser.username === user.username || otherUser.id === user.id;
  });

  if (duplicateUsers.length === 0) {
    this.users.push(user);
    return true;
  } else {
    return false;
  }
};

State.prototype.removeUser = function(user) {
  this.users = this.users.filter(function(otherUser) {
    return otherUser.id !== user.id;
  });
}

State.prototype.addMessage = function(message) {
  this.messages.push(message);
};

// N.B.: The server should ignore any ID given by the client and assign its own
// ID to the listing, which is then returned to the client.
State.prototype.addListing = function(auctionItem) {
  this.auction.unshift(auctionItem);
};

// Returns a status code, which is one of: 'OK', 'bid not high enough', 'auction closed',
// or 'item does not exist'. The frontend can ignore these status codes since
// the operation is guaranteed to succeed.
State.prototype.addBid = function(bid) {
  var matchingItems = this.auction.filter(function(item) {
    return item.id === bid.itemId;
  });

  if (matchingItems.length > 0) {
    var item = matchingItems[0];

    if (item.status === 'open') {
      if (bidIsHighEnough(item, bid)) {
        item.bids.unshift(bid);
        return 'OK';
      } else {
        return 'bid not high enough';
      }
    } else {
      return 'auction closed';
    }
  } else {
    return 'item does not exist';
  }
};

// Sets the status of the auction item with the given ID to closed.
State.prototype.closeAuction = function(id) {
  this.auction.forEach(function(otherItem) {
    if (otherItem.id === id) {
      otherItem.status = 'closed';
    }
  });
};

if (typeof window === 'undefined') {
  module.exports = {
    User: User,
    Message: Message,
    AuctionItem: AuctionItem,
    Bid: Bid,
    State: State,
    bidIsHighEnough: bidIsHighEnough
  };
}
