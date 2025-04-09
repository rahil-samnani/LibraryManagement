angular.module('libraryApp')
    .controller('ThemeController', ['$scope', 'ThemeService', function ($scope, ThemeService) {
        $scope.currentTheme = ThemeService.initTheme();

        $scope.toggleTheme = function () {
            $scope.currentTheme = ThemeService.toggleTheme($scope.currentTheme);
        };
    }]);