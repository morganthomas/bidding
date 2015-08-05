var biddingApp = angular.module('biddingApp', ['ngRoute']);

biddingApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/login',
      controller: 'loginController'
    })
    .when('/main', {
      templateUrl: '/templates/main',
      controller: 'mainController'
    });
})

biddingApp.controller('loginController', function($scope, stateFactory, $location) {

  $scope.loginHandler = function() {
    // Pass null as the id because the server will reassign the id
    socket.emit('login', new User(null, $scope.username));
    socket.on('login-response', function(data){
        if (!data) {
          alert("Username already taken!");
          return;
        }

        $scope.$apply(function() {
            stateFactory.auction = data.state.auction;
            stateFactory.messages = data.state.messages;
            stateFactory.users = data.state.users;

            stateFactory.me = new User(data.id, $scope.username);

            $location.path("/main")
        })

    });
  }

});

biddingApp.factory('stateFactory', function() {
    var state = new State();
    state.me = null;

    return state;
})

biddingApp.controller('mainController', function($scope, stateFactory, $location) {
  $scope.state = stateFactory;

  if (!stateFactory.me) {
    $location.path('/');
  }
});

biddingApp.controller('biddingController', function($scope, stateFactory) {
  console.log('Bidding!');

  socket.on('create-listing', function(auctionItem) {
    console.log(auctionItem);
    $scope.$apply(function() {
      stateFactory.addListing(auctionItem);
      auctionItem.timeRemaining = Math.round((Date.parse(auctionItem.endTime) - Date.now()) / 1000);
    });
    // console.log('create-listing rec', data);
  });

  socket.on('auction-end', function(data) {
    $scope.$apply(function() {
      stateFactory.closeAuction(data.id);
    });
  })

  socket.on('create-bid', function(data) {
    $scope.$apply(function() {
      console.log("Makin a bid!")
      stateFactory.addBid(data);
    });
  });

  setInterval(function() {
    stateFactory.auction.forEach(function(auctionItem) {
      if (auctionItem.status === 'open' && auctionItem.timeRemaining > 0) {
        $scope.$apply(function() {
          auctionItem.timeRemaining--;
        })
      }
    })
  }, 1000);

  $scope.openListingsFilter = function(auctionItem) {
    return auctionItem.status === 'open';
  };

  $scope.closedListingsFilter = function(auctionItem) {
    return auctionItem.status === 'closed';
  }

  $scope.submitBid = function(listing){
    socket.emit('create-bid', {
      itemId  : listing.id,
      price   : listing.mybid
    });
  };

  $scope.startAuction = function() {
    var auctionDurationMins = parseFloat($scope.startAuctionForm.auctionDurationMins);

    if (isNaN(auctionDurationMins)) {
      alert("Please enter a number for the auction duration!");
      return;
    }

    var auctionItem = {
      name: $scope.startAuctionForm.name,
      imageUrl: $scope.startAuctionForm.imageUrl,
      auctionDurationMins: auctionDurationMins
    };

    socket.emit('create-listing', auctionItem);
  }
})
