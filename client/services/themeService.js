angular.module('libraryApp')
    .service('ThemeService', ['$cookies', function ($cookies) {
        var theme = {};

        // Initialize theme
        theme.initTheme = function () {
            var savedTheme = $cookies.get('theme');
            return savedTheme || 'dark-mode'; // Default to dark mode
        };

        // Toggle theme
        theme.toggleTheme = function (currentTheme) {
            var newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            $cookies.put('theme', newTheme);
            return newTheme;
        };

        return theme;
    }]);