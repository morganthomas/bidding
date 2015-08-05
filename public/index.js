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
        $scope.$apply(function() {
            stateFactory.auction = data.state.auction;
            stateFactory.messages = data.state.messages;
            stateFactory.users = data.state.users;
        
            $scope.user = new User(data.id, $scope.username);
            
            $location.path("/main")
        })
        
    });
  }
  
});

biddingApp.factory('stateFactory', function() {
    var state = new State();
    
    return state;
})

biddingApp.controller('mainController', function($scope, stateFactory) {
  $scope.state = stateFactory;
});
