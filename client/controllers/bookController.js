angular.module('libraryApp')
  .controller('BookController', ['$scope', '$location', '$routeParams', 'BookService', 'AuthService', 
    function($scope, $location, $routeParams, BookService, AuthService) {
    
    $scope.books = [];
    $scope.book = {};
    $scope.error = '';
    $scope.success = '';
    $scope.filter = {
      genre: '',
      searchText: ''
    };
    $scope.genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Fantasy', 'Romance', 'Thriller', 'Mystery'];
    
    // Check if user is admin
    $scope.isAdmin = function() {
      var user = AuthService.getUser();
      return user && user.role === 'admin';
    };
    
    // Get all books
    $scope.getBooks = function() {
      BookService.getBooks()
        .then(function(response) {
          $scope.books = response.data;
        })
        .catch(function(err) {
          $scope.error = 'Error loading books';
        });
    };
    
    // Get book by ID
    $scope.getBookById = function() {
      if ($routeParams.id) {
        BookService.getBookById($routeParams.id)
          .then(function(response) {
            $scope.book = response.data;
          })
          .catch(function(err) {
            $scope.error = 'Book not found';
          });
      }
    };
    
    // Add new book
    $scope.addBook = function() {
      if (!$scope.book.title || !$scope.book.author || !$scope.book.genre || 
          !$scope.book.price || $scope.book.copies === undefined) {
        $scope.error = 'Please fill in all required fields';
        return;
      }
      
      BookService.addBook($scope.book)
        .then(function(response) {
          $scope.success = 'Book added successfully';
          $scope.book = {};
          $location.path('/books');
        })
        .catch(function(err) {
          $scope.error = err.data.msg || 'Error adding book';
        });
    };
    
    // Update book copies
    $scope.updateCopies = function(book) {
      BookService.updateCopies(book._id, book.copies)
        .then(function(response) {
          $scope.success = 'Book copies updated';
        })
        .catch(function(err) {
          $scope.error = err.data.msg || 'Error updating book copies';
        });
    };
    
    // Filter books by genre
    $scope.filterByGenre = function(book) {
      if (!$scope.filter.genre) {
        return true;
      }
      return book.genre === $scope.filter.genre;
    };
    
    // Filter books by search text
    $scope.filterByText = function(book) {
      if (!$scope.filter.searchText) {
        return true;
      }
      var search = $scope.filter.searchText.toLowerCase();
      return book.title.toLowerCase().includes(search) || 
             book.author.toLowerCase().includes(search) ||
             book.description.toLowerCase().includes(search);
    };
    
    // Reset filters
    $scope.resetFilters = function() {
      $scope.filter = {
        genre: '',
        searchText: ''
      };
    };
    
    // Initialize controller based on route
    if ($location.path() === '/books' || $location.path() === '/') {
      $scope.getBooks();
    } else if ($routeParams.id) {
      $scope.getBookById();
    }
  }]);