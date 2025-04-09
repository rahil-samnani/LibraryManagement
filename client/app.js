angular.module('libraryApp', ['ngRoute', 'ngSanitize', 'ngCookies'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'BookController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthController'
      })
      .when('/books', {
        templateUrl: 'views/books.html',
        controller: 'BookController',
        resolve: {
          auth: ['$q', 'AuthService', function($q, AuthService) {
            return AuthService.isLoggedIn() ? $q.resolve() : $q.reject({ redirectTo: '/login' });
          }]
        }
      })
      .when('/books/add', {
        templateUrl: 'views/add-book.html',
        controller: 'BookController',
        resolve: {
          auth: ['$q', 'AuthService', function($q, AuthService) {
            return AuthService.isLoggedIn() ? $q.resolve() : $q.reject({ redirectTo: '/login' });
          }]
        }
      })
      .when('/books/:id', {
        templateUrl: 'views/book-detail.html',
        controller: 'BookController',
        resolve: {
          auth: ['$q', 'AuthService', function($q, AuthService) {
            return AuthService.isLoggedIn() ? $q.resolve() : $q.reject({ redirectTo: '/login' });
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  }])
  .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      if (rejection && rejection.redirectTo) {
        $location.path(rejection.redirectTo);
      }
    });
    
    // Check if user is logged in
    AuthService.checkLogin();
  }]);