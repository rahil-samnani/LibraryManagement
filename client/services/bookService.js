angular.module('libraryApp')
  .service('BookService', ['$http', 'AuthService', function($http, AuthService) {
    var book = {};
    
    // Set auth token for requests
    function setHeaders() {
      return {
        headers: {
          'x-auth-token': AuthService.getToken()
        }
      };
    }
    
    // Get all books
    book.getBooks = function() {
      return $http.get('/api/books');
    };
    
    // Get book by ID
    book.getBookById = function(id) {
      return $http.get('/api/books/' + id);
    };
    
    // Add new book
    book.addBook = function(bookData) {
      return $http.post('/api/books', bookData, setHeaders());
    };
    
    // Update book copies
    book.updateCopies = function(id, copies) {
      return $http.patch('/api/books/' + id + '/copies', { copies: copies }, setHeaders());
    };
    
    // Update book
    book.updateBook = function(id, bookData) {
      return $http.put('/api/books/' + id, bookData, setHeaders());
    };
    
    // Delete book
    book.deleteBook = function(id) {
      return $http.delete('/api/books/' + id, setHeaders());
    };
    
    return book;
  }]);