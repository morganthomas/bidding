var biddingApp = angular.module('biddingApp', ['ngRoute']);

biddingApp.config(function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: '/templates/login',
      controller: 'loginController'
    })
    .when('/main', {
      templateUrl: '/templates/main',
      controller: 'mainController'
    });
})

biddingApp.controller('loginController', function($scope) {
  $scope.loginHandler = function() {
    console.log("Loggin' in!", $scope.username);


  }
});

biddingApp.sessionController('sessionController', function($scope) {
  $scope.user = null;
  $scope.state = null;
})
