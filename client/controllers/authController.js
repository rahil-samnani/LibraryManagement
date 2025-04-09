angular.module('libraryApp')
  .controller('AuthController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.user = {};
    $scope.error = '';
    
    // Register user
    $scope.register = function() {
      if (!$scope.user.username || !$scope.user.email || !$scope.user.password) {
        $scope.error = 'Please fill in all fields';
        return;
      }
      
      AuthService.register($scope.user)
        .then(function(response) {
          return AuthService.login({
            username: $scope.user.username,
            password: $scope.user.password
          });
        })
        .then(function() {
          $location.path('/books');
        })
        .catch(function(err) {
          $scope.error = err.data.msg || 'Registration failed';
        });
    };
    
    // Login user
    $scope.login = function() {
      if (!$scope.user.username || !$scope.user.password) {
        $scope.error = 'Please fill in all fields';
        return;
      }
      
      AuthService.login($scope.user)
        .then(function() {
          $location.path('/books');
        })
        .catch(function(err) {
          $scope.error = err.data.msg || 'Login failed';
        });
    };
  }]);