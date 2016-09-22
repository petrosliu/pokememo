// app.js

// define our application and pull in ngRoute and ngAnimate
var pokememo = angular.module('pokememo', ['ngRoute', 'ngAnimate']);
var hostname = '';
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
    $scope.getPokedex = function () {
        if ($window.localStorage['token']) {
            $http.get(hostname + '/api/pokedex', {
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
        $http.get(hostname + '/api/pokemons')
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

    $scope.removeUser = function () {
        delete $window.localStorage['token'];
        delete $scope.user;
        $window.location.reload();
    }
    $scope.authUser = function () {
        if ($window.localStorage['token']) {
            $http.get(hostname + '/api/users', {
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
    $scope.getPokedex();
});

pokememo.controller('homeController', function ($scope, $http, $window) {
    $scope.logform = {};
    $scope.login = function () {
        $http.post(hostname + '/api/users/login', $scope.logform)
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
        $http.post(hostname + '/api/users/signup', $scope.logform)
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
        $http.post(hostname + '/api/users', { update: $scope.user.update, token: $window.localStorage['token'] })
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
    $scope.register = function (pokemon) {
        if ($window.localStorage['token'] && !$scope.pokedex[pokemon.id]) {
            $http.post(hostname + '/api/pokedex', { pokemon: pokemon.id, token: $window.localStorage['token'] })
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
                $http.delete(hostname + '/api/pokedex/' + pokemon.id, { params: { token: $window.localStorage['token'] } })
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
            $http.post(hostname + '/api/pokedex/' + $scope.modal.pokemon.id, { candy_amount: $scope.modal.candy_amount, token: $window.localStorage['token'] })
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
    var getMySpawns = function (callback) {
        $scope.render.spin = true;
        if ($window.localStorage['token']) {
            $http.get(hostname + '/api/spawns', {
                params: { token: $window.localStorage['token'] }
            })
                .success(function (data) {
                    $scope.mySpawns = data;
                    callback(null, data);
                    $timeout(function () {
                        $scope.render.spin = false;
                    }, 500);
                })
                .error(function (data) {
                    callback(data, null);
                    $timeout(function () {
                        $scope.render.spin = false;
                    }, 500);
                });
        }
        else {
            callback(null, []);
            $timeout(function () {
                $scope.render.spin = false;
            }, 500);
        }
    };

    $scope.render = { map: false, spin: true };
    $scope.getPokedex();
    getMySpawns(function (err, res) {
        if (err) {
            Materialize.toast('Error: ' + err, 2000);
        }
        else {
            $timeout(function () {
                $scope.render.map = true;
            }, 1000);
        }
    });
    $scope.mapInit = function () {
        $scope.render.spin = true;
        $scope.map = mapInit();
        loadSpawnMarker = getMySpawns;
        addSpawnMarkers($scope.mySpawns);
        $timeout(function () {
            $scope.render.spin = false;
        }, 1500);
    }
});

pokememo.controller('spawnController', function ($scope, $http, $location, $window) {
    $scope.getPokemonById = function (id) {
        $http.get(hostname + '/api/pokemons/' + id)
            .success(function (data) {
                $scope.info.data.push(data);
            })
            .error(function (data) {
                console.log(data);
            });
    };

    $scope.getSighting = function () {
        $http.get(hostname + '/api/spawns/' + $scope.info.latitude + '/' + $scope.info.longitude)
            .success(function (data) {
                if (data) {
                    $scope.info.pokemons = data.pokemons;
                    $scope.info.data = [];
                    for (var i = 0; i < $scope.info.pokemons.length; i++) {
                        $scope.getPokemonById($scope.info.pokemons[i]);
                    }
                }
                else {
                    $scope.info.pokemons = null;
                    $scope.info.data = null;
                }
            })
            .error(function (data) {
                $scope.info.pokemons = null;
                $scope.info.data = null;
            });
    };

    $scope.addSighting = function (keyEvent) {
        if (keyEvent.which === 13) {
            if ($scope.addSighting.id) {
                $http.get(hostname + '/api/pokemons/' + $scope.addSighting.id)
                    .success(function (p) {
                        if (p) {
                            $http.post(hostname + '/api/spawns', { pokemon: p.id, latitude: $scope.info.latitude, longitude: $scope.info.longitude, token: $window.localStorage['token'] })
                                .success(function (data) {
                                    $scope.getSighting();
                                });
                        }
                    });
            }
            $scope.addSighting.id = "";
            $scope.addSightingBtnFunc("");
        }
    };
    $scope.addSpawn = function () {
        parent.requireUpdateSpawnMarkers = true;
        $http.post(hostname + '/api/spawns', { latitude: $scope.info.latitude, longitude: $scope.info.longitude, token: $window.localStorage['token'] })
            .success(function (data) {
                $scope.getSighting();
            });
    };
    $scope.getETA = function () {
        $scope.distance = { 'distance': '---', 'duration': '---' };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                getDistance({ lat: position.coords.latitude, lng: position.coords.longitude }, { lat: +$scope.info.latitude, lng: +$scope.info.longitude }, function (err, res) {
                    if (err) console.log(err);
                    else {
                        $scope.distance = res;
                    }
                });
            });
        }
    };

    $scope.info = $location.search();
    if (window.self === window.top || $scope.info.latitude === undefined || $scope.info.longitude === undefined) location.pathname = '/';
    geocodeLatLng($scope.info.latitude, $scope.info.longitude, function (err, geoinfo) {
        if (err) console.log(err);
        else {
            $scope.info.address = geoinfo.formatted_address;
            $scope.$apply();
        }
    });
    $scope.getSighting();

    $scope.addSightingBtn = 'assets/images/map/addSighting.svg';
    $scope.addSightingBtnFunc = function () {
        if ($scope.addSighting.id) {
            $http.get(hostname + '/api/pokemons/' + $scope.addSighting.id)
                .success(function (data) {
                    if (data) $scope.addSightingBtn = data.img;
                    else $scope.addSightingBtn = 'assets/images/map/addSighting.svg';
                })
                .error(function (data) {
                    $scope.addSightingBtn = 'assets/images/map/addSighting.svg';
                });
        }
        else $scope.addSightingBtn = 'assets/images/map/addSighting.svg';
    };
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
