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
pokememo.controller('homeController', function ($scope, $http, $window) {
    $scope.form = {};
    $scope.login = function () {
        $http.post('/api/users/login', $scope.form)
            .success(function (data) {
                $window.localStorage['token'] = data.token;
                $scope.form = {};
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    $scope.signup = function () {
        $http.post('/api/users/signup', $scope.form)
            .success(function (data) {
                console.log(data);
                $scope.form = {};
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});

pokememo.controller('pokedexController', function ($scope, $http, $window) {
    $scope.getPokedex =function(){
        $scope.pokedex = {};
        if ($window.localStorage['token']) {
            $http.get('/api/pokedex', {
                params: { token: $window.localStorage['token'] }
            })
                .success(function (data) {
                    $scope.pokedex = {};
                    for(var i=0;i<data.length;i++){
                        $scope.pokedex[data[i].pokemon]=true;
                        $scope.pokedex[data[i].candy]=data[i].candy_amount;
                    }
                    $scope.getPokemon();
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
        else $scope.getPokemon();
    };

    $scope.getPokemon = function(){
        $http.get('/api/pokemons')
            .success(function (data) {
                $scope.pokemon = data;
                for(var i=0;i<$scope.pokemon.length;i++){
                    $scope.pokemon[i].registered = ($scope.pokedex[$scope.pokemon[i].name] === true);
                    if($scope.pokemon[i].registered) $scope.pokemon[i].keywords.push('catched');
                    else $scope.pokemon[i].keywords.push('unseen');
                    $scope.pokemon[i].candy_amount = $scope.pokedex[$scope.pokemon[i].candy] || 0;
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    
    $scope.register = function(pokemon){
        $http.post('/api/pokedex',{pokemon:pokemon,token:$window.localStorage['token']})
            .success(function (data) {
                $scope.getPokedex();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    $scope.deregister = function(pokemon){
        $http.delete('/api/pokedex/'+pokemon,{params: {token:$window.localStorage['token']}})
            .success(function (data) {
                $scope.getPokedex();
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    $scope.getPokedex();
    
});

pokememo.controller('mapController', function ($scope, $timeout) {
    var addMarker = function (map, markers, loc) {
        markers.push(new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: loc,
            icon: {
                url: '/assets/images/map/marker.png',
                size: new google.maps.Size(64, 76),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 38),
                scaledSize: new google.maps.Size(32, 38)
            }
        }));
        markers[markers.length - 1].addListener('click', function () {
            map.setZoom(17);
            map.setCenter(loc);
        });
    };
    var addYourLocationButton = function (map, marker) {
        var controlDiv = document.createElement('div');

        var firstChild = document.createElement('button');
        firstChild.style.backgroundColor = '#fff';
        firstChild.style.border = 'none';
        firstChild.style.outline = 'none';
        firstChild.style.width = '28px';
        firstChild.style.height = '28px';
        firstChild.style.borderRadius = '2px';
        firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        firstChild.style.cursor = 'pointer';
        firstChild.style.marginRight = '10px';
        firstChild.style.padding = '0px';
        firstChild.title = 'Your Location';
        controlDiv.appendChild(firstChild);

        var secondChild = document.createElement('div');
        secondChild.style.margin = '5px';
        secondChild.style.width = '18px';
        secondChild.style.height = '18px';
        secondChild.style.backgroundImage = 'url(/assets/images/map/currentLocationBtn.png)';
        secondChild.style.backgroundSize = '180px 18px';
        secondChild.style.backgroundPosition = '0px 0px';
        secondChild.style.backgroundRepeat = 'no-repeat';
        secondChild.id = 'you_location_img';
        firstChild.appendChild(secondChild);

        google.maps.event.addListener(map, 'dragend', function () {
            $('#you_location_img').css('background-position', '0px 0px');
        });

        firstChild.addEventListener('click', function () {
            var imgX = '0';
            var animationInterval = setInterval(function () {
                if (imgX == '-18') imgX = '0';
                else imgX = '-18';
                $('#you_location_img').css('background-position', imgX + 'px 0px');
            }, 500);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    marker.setPosition(latlng);
                    map.setCenter(latlng);
                    map.setZoom(17);
                    clearInterval(animationInterval);
                    $('#you_location_img').css('background-position', '-144px 0px');
                    marker.setMap(map);
                });
            }
            else {
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '0px 0px');
            }
        });

        controlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    };

    $scope.mapInit = function () {
        var mapOptions = {
            center: new google.maps.LatLng(34.009123, -118.497043),
            zoom: 14,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
            },
            disableDoubleClickZoom: false,
            mapTypeControl: false,
            scaleControl: true,
            rotateControl: true,
            scrollwheel: true,
            panControl: true,
            streetViewControl: false,
            draggable: true,
            overviewMapControl: true,
            overviewMapControlOptions: {
                opened: false,
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [{ "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "color": "#27bda2" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#a1f199" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "color": "#37bda2" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{ "color": "#37bda2" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.attraction", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "color": "#e4dfd9" }] }, { "featureType": "poi.business", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.government", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#37bda2" }, { "visibility": "on" }] }, { "featureType": "poi.place_of_worship", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.school", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#4f8c7b" }, { "visibility": "on" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "weight": "4.96" }, { "color": "#f8f98e" }, { "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "weight": "1.00" }] }, { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#f8f98e" }] }, { "featureType": "road.highway.controlled_access", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#dce96e" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#dce96e" }] }, { "featureType": "road.local", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.station.bus", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#5ddad6" }] }]
        }
        var mapElement = document.getElementById('map');
        map = new google.maps.Map(mapElement, mapOptions);
        var locations = [
            [37.559233, -121.968424],
            [37.557470, -121.968200],
            [37.558296, -121.967140],
            [37.557563, -121.966828]
        ];
        var markers = [];

        for (var i = 0; i < locations.length; i++) {
            addMarker(map, markers, new google.maps.LatLng(locations[i][0], locations[i][1]));
        }

        var currentLoc = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: map.getCenter(),
            icon: {
                url: '/assets/images/map/currentLocation.png',
                size: new google.maps.Size(64, 64),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(14, 14),
                scaledSize: new google.maps.Size(28, 28)
            }
        });
        addYourLocationButton(map, currentLoc);

    };
    $scope.render = false;
    $timeout(function () {
        $scope.render = true;
    }, 1500);
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
