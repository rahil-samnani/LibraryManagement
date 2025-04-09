angular.module('libraryApp')
  .controller('NavbarController', ['$scope', '$location', 'AuthService', 
    function($scope, $location, AuthService) {
    
    $scope.isLoggedIn = function() {
      return AuthService.isLoggedIn();
    };
    
    $scope.getUser = function() {
      return AuthService.getUser();
    };
    
    $scope.logout = function() {
      AuthService.logout();
      $location.path('/login');
    };
  }]);
