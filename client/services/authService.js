angular.module('libraryApp')
  .service('AuthService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
    var auth = {};
    
    // Register a new user
    auth.register = function(user) {
      return $http.post('/api/auth/register', user);
    };
    
    // Login user
    auth.login = function(user) {
      return $http.post('/api/auth/login', user)
        .then(function(response) {
          $cookies.put('token', response.data.token);
          $cookies.putObject('user', response.data.user);
          $rootScope.currentUser = response.data.user;
          return response;
        });
    };
    
    // Logout user
    auth.logout = function() {
      $cookies.remove('token');
      $cookies.remove('user');
      $rootScope.currentUser = null;
    };
    
    // Check if user is logged in
    auth.isLoggedIn = function() {
      return !!$cookies.get('token');
    };
    
    // Get auth token
    auth.getToken = function() {
      return $cookies.get('token');
    };
    
    // Get current user
    auth.getUser = function() {
      return $cookies.getObject('user');
    };
    
    // Check if user is logged in on page refresh
    auth.checkLogin = function() {
      if (auth.isLoggedIn()) {
        $rootScope.currentUser = auth.getUser();
      }
    };
    
    return auth;
  }]);