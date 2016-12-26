// app.js

// define our application and pull in ngRoute and ngAnimate
var pokememo = angular.module('pokememo', ['ngRoute', 'ngAnimate']);
var hostname = '';
var isNotMobile = (function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return !check;
})();
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
                    data[i].buddy_mileage = 1001;
                    if (data[i].registered || data[i].candy_amount) {
                        data[i].buddy_mileage = 999;
                        if (data[i].candy_amount < data[i].candy_count) {
                            data[i].buddy_mileage = (data[i].candy_count - data[i].candy_amount) * data[i].buddy;
                        }
                    }
                    if (data[i].registered) {
                        data[i].keywords.push('catched');
                        data[i].progress = 1000;
                    }
                    else {
                        data[i].keywords.push('unseen');
                        data[i].progress = data[i].candy_count - data[i].candy_amount || 999;
                        if (data[i].location === 'Unavailable') data[i].progress = 1001;
                    }
                    if (isNotMobile) data[i].img = data[i].gif;
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

    $scope.showModel = function (idx) {
        $scope.modal.index = idx;
        var pokemon = $filter('orderBy')($filter('filter')($scope.pokemon, { keywords: $scope.query }), $scope.sortBy)[idx];
        if (pokemon) {
            $scope.modal.pokemon = pokemon;
            if ($scope.pokedex[pokemon.id] || $scope.pokedex[pokemon.candy] !== undefined) {
                $scope.modal.candy_amount = $scope.pokedex[pokemon.candy];
                $scope.modal.disable = false;
            }
            else {
                $scope.modal.candy_amount = 0;
                $scope.modal.disable = true;
            }
            $('#pokemon-modal').openModal();
        }
        else {
            $('#pokemon-modal').closeModal();
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

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-71764085-1', 'auto');
ga('send', 'pageview');