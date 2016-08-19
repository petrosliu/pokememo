// app.js

// define our application and pull in ngRoute and ngAnimate
var pokememo = angular.module('pokememo', ['ngRoute', 'ngAnimate']);

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
pokememo.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })
        .when('/pokedex', {
            templateUrl: 'views/pokedex.html',
            controller: 'pokedexController'
        })
        .otherwise({ redirectTo: '/' })
});


// CONTROLLERS ============================================
// home page controller
pokememo.controller('homeController', function ($scope) {

});

// about page controller
pokememo.controller('pokedexController', function ($scope, $http) {

    $http.get('/api/pokedex')
        .success(function (data) {
            $scope.pokedex = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
});



pokememo.filter('spaceless', function () {
    return function (input) {
        if (input) {
            return input.replace(/\s+/g, '-');
        }
    }
});

pokememo.filter('pokeidx', function () {
    return function (input) {
        if (input >= 0 && input <= 999) {
            return ("000" + input).slice(-3);
        }
        else return ("???");
    }
});
