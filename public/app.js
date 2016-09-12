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
        .when('/map', {
            templateUrl: 'views/map.html',
            controller: 'mapController'
        })
        .otherwise({ redirectTo: '/' });
});


// CONTROLLERS ============================================
pokememo.controller('mainController', function ($scope, $http, $window) {
    $scope.removeUser = function () {
        delete $window.localStorage['token'];
        delete $scope.user;
        $window.location.reload();
    }
    $scope.authUser = function () {
        if ($window.localStorage['token']) {
            $http.get('/api/users', {
                params: { token: $window.localStorage['token'] }
            })
                .success(function (data) {
                    $scope.user = data.user;
                    $scope.user.token = $window.localStorage['token'];
                    Materialize.toast('Hi, ' + $scope.user.name + '!', 2000);
                })
                .error(function (data) {
                    $scope.removeUser();
                    Materialize.toast('Error: ' + data, 2000);
                });
        }
    };

    $scope.authUser();
});

pokememo.controller('homeController', function ($scope, $http, $window) {
    $scope.logform = {};
    $scope.login = function () {
        $http.post('/api/users/login', $scope.logform)
            .success(function (data) {
                $window.localStorage['token'] = data.token;
                $scope.logform = {};
                $scope.authUser();
            })
            .error(function (data) {
                Materialize.toast('Error: ' + data, 2000);
            });
    };
    $scope.signup = function () {
        $http.post('/api/users/signup', $scope.logform)
            .success(function (data) {
                $scope.logform = {};
                Materialize.toast('Signed up successfully.', 2000);
            })
            .error(function (data) {
                Materialize.toast('Error: ' + data, 2000);
            });
    };
    $scope.newUpdate = function () {
        $scope.user.update = { player: {} };
        $scope.user.update.username = $scope.user.username;
        $scope.user.update.player.id = $scope.user.player.id;
        $scope.user.update.player.team = $scope.user.player.team;
        $scope.user.update.player.level = $scope.user.player.level;
    };
    $scope.updateUser = function () {
        if ($scope.user.update.username === '') delete $scope.user.update.username;
        if ($scope.user.update.password === '') delete $scope.user.update.password;
        $http.post('/api/users', { update: $scope.user.update, token: $window.localStorage['token'] })
            .success(function (data) {
                Materialize.toast('Profile updated!', 2000);
                $scope.authUser();
            })
            .error(function (data) {
                Materialize.toast('Error: ' + data, 2000);
            });
        delete $scope.user.update;
    };
});

pokememo.controller('pokedexController', function ($scope, $http, $window, $filter) {
    $scope.getPokedex = function () {
        if ($window.localStorage['token']) {
            $http.get('/api/pokedex', {
                params: { token: $window.localStorage['token'] }
            })
                .success(function (data) {
                    var pokedex = {};
                    for (var i = 0; i < data.length; i++) {
                        pokedex[data[i].pokemon] = true;
                        pokedex[data[i].candy] = data[i].candy_amount;
                    }
                    $scope.pokedex = pokedex;
                    $scope.getPokemon();
                })
                .error(function (data) {
                    Materialize.toast('Error: ' + data, 2000);
                });
        }
        else {
            $scope.pokedex = {};
            $scope.getPokemon();
        }
    };

    $scope.getPokemon = function () {
        $http.get('/api/pokemons')
            .success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].registered = ($scope.pokedex[data[i].id] === true);
                    data[i].candy_amount = +$scope.pokedex[data[i].candy] || 0;
                    if (data[i].registered) {
                        data[i].keywords.push('catched');
                        data[i].progress = 1000;
                    }
                    else {
                        data[i].keywords.push('unseen');
                        data[i].progress = data[i].candy_count - data[i].candy_amount || 999;
                        if (data[i].location === 'Unavailable') data[i].progress = 1001;
                    }
                }
                $scope.pokemon = data;
            })
            .error(function (data) {
                Materialize.toast('Error: ' + data, 2000);
            });
    };

    $scope.register = function (pokemon) {
        if ($window.localStorage['token'] && !$scope.pokedex[pokemon.id]) {
            $http.post('/api/pokedex', { pokemon: pokemon.id, token: $window.localStorage['token'] })
                .success(function (data) {
                    $scope.getPokedex();
                    Materialize.toast(pokemon.name + ' registered!', 2000);
                })
                .error(function (data) {
                    Materialize.toast('Error: ' + data, 2000);
                });
        }
    };
    $scope.deregister = function (pokemon) {
        if ($window.localStorage['token'] && $scope.pokedex[pokemon.id]) {
            if ($window.confirm("Please confirm deregister?")) {
                $http.delete('/api/pokedex/' + pokemon.id, { params: { token: $window.localStorage['token'] } })
                    .success(function (data) {
                        $scope.getPokedex();
                        Materialize.toast(pokemon.name + ' deregistered!', 2000);
                        $('#pokemon-modal').closeModal();
                    })
                    .error(function (data) {
                        Materialize.toast('Error: ' + data, 2000);
                    });
            }
        }
    };

    $scope.showModel = function (pokemon) {
        if ($scope.pokedex[pokemon.id] || $scope.pokedex[pokemon.candy] !== undefined) {
            $scope.modal.pokemon = pokemon;
            $scope.modal.candy_amount = $scope.pokedex[pokemon.candy];
            $('#pokemon-modal').openModal();
        }
    };

    $scope.updateCandy = function () {
        if ($window.localStorage['token']) {
            $http.post('/api/pokedex/' + $scope.modal.pokemon.id, { candy_amount: $scope.modal.candy_amount, token: $window.localStorage['token'] })
                .success(function (data) {
                    $scope.getPokedex();
                    Materialize.toast($scope.modal.pokemon.candy + ' updated!', 2000);
                })
                .error(function (data) {
                    Materialize.toast('Error: ' + data, 2000);
                });
        }
    };
    $scope.envolve = function (count, amount) {
        if (count) {
            var times = 0;
            while (amount >= count) {
                times = times + Math.floor(amount / count);
                amount = amount % count + Math.floor(amount / count);
            }
            return times;
        }
        else return 0;
    }

    $scope.modal = {};
    $scope.getPokedex();
});

pokememo.controller('mapController', function ($scope, $timeout, $http, $window) {
    var getSpawns = function (latTop, latBottom, lngLeft, lngRight) {

    };
    var getMySpawns = function () {
        if ($window.localStorage['token']) {
            $http.get('api/spawns', {
                params: { token: $window.localStorage['token'] }
            })
                .success(function (data) {
                    $scope.mySpawns = data;
                    $timeout(function () {
                        $scope.render.map = true;
                    }, 1000);
                })
                .error(function (data) {
                    Materialize.toast('Error: ' + data, 2000);
                });
        }
        else {
            $timeout(function () {
                $scope.render.map = true;
            }, 1500);
        }
    };

    $scope.render = { map: false, spin: true };
    getMySpawns();
    $scope.mapInit = function () {
        $scope.map = mapInit();
        addSpawnMarkers($scope.mySpawns);
        $timeout(function () {
            $scope.render.spin = false;
        }, 1500);
    }
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

pokememo.filter('teamcolor', function () {
    return function (input) {
        if (input === 'Instinct') return 'yellow';
        else if (input === 'Valor') return 'red';
        else if (input === 'Mystic') return 'blue';
        else return 'grey';
    }
});

pokememo.filter('progress', function () {
    return function (input) {
        return Math.min(input, 100);
    }
});
