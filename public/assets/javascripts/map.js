var map = null;
var spawnMarkers = [];
var myLocationMarker = null;
var _pkmm_pokemons = null;
var geocoder = null;
var DistanceMatrixService = null;
var newSpawnMarker = null;
var loadSpawnMarker = null;
var requireUpdateSpawnMarkers = false;

var icons = {
    'sighting': {
        url: '/assets/images/map/marker.png',
        size: new google.maps.Size(64, 76),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 38),
        scaledSize: new google.maps.Size(32, 38)
    },
    'sighting_active': {
        url: '/assets/images/map/marker_active.png',
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 16),
        scaledSize: new google.maps.Size(32, 32)
    },
    'sighting_near': {
        url: '/assets/images/map/marker_near.png',
        size: new google.maps.Size(64, 76),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 38),
        scaledSize: new google.maps.Size(32, 38)
    },
    'sighting_near_active': {
        url: '/assets/images/map/marker_near_active.png',
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 16),
        scaledSize: new google.maps.Size(32, 32)
    },
    'myLocation': {
        url: '/assets/images/map/currentLocation.png',
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24)
    }
};

var linearTween = function (t, b, c, d) {
    return c * t / d + b;
};
var easeInExpo = function (t, b, c, d) {
    return c * Math.pow(2, 10 * (t / d - 1)) + b;
};
var easeOutExpo = function (t, b, c, d) {
    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
};
var easeInOutExpo = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    t--;
    return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};

var windowTransition = function (location, zoom, callback) {
    var startLat = map.getCenter().lat();
    var startLng = map.getCenter().lng();
    var startZoom = map.getZoom();
    var times = 20;
    var t = 0;

    var itv = setInterval(function () {
        if (zoom > startZoom) {
            map.setCenter({ lat: easeOutExpo(t, startLat, location.lat() - startLat, times), lng: easeOutExpo(t, startLng, location.lng() - startLng, times) });
            map.setZoom(Math.round(easeInExpo(t, startZoom, zoom - startZoom, times)));
        }
        else if (zoom < startZoom) {
            map.setCenter({ lat: easeInExpo(t, startLat, location.lat() - startLat, times), lng: easeInExpo(t, startLng, location.lng() - startLng, times) });
            map.setZoom(Math.round(easeOutExpo(t, startZoom, zoom - startZoom, times)));
        }
        else map.setCenter({ lat: easeInOutExpo(t, startLat, location.lat() - startLat, times), lng: easeInOutExpo(t, startLng, location.lng() - startLng, times) });

        if (t++ >= times) {
            map.setCenter(location);
            map.setZoom(zoom);
            window.clearInterval(itv);
            if (callback) callback();
        }
    }, 5);
}

var openCircleTransition = function (marker, circle, callback) {
    var radius = circle.getRadius();
    circle.setRadius(0);
    circle.setMap(map);
    var times = 20;
    var t = 0;
    var itv = setInterval(function () {
        circle.setRadius(easeInOutExpo(t, 0, radius, times));
        if (t++ >= times) {
            circle.setRadius(radius);
            window.clearInterval(itv);
            if (callback) callback();
        }
    }, 5);
}

var closeCircleTransition = function (marker, circle, callback) {
    var radius = circle.getRadius();
    var times = 20;
    var t = 0;
    var itv = setInterval(function () {
        circle.setRadius(easeInOutExpo(t, radius, -radius, times));
        if (t++ >= times) {
            circle.setMap(null);
            circle.setRadius(radius);
            window.clearInterval(itv);
            if (callback) callback();
        }
    }, 5);
}

var scanCirclesTransition = function (marker, circles, callback) {
    circles.scan.setMap(map);
    var t = circles.scan.getRadius();
    var itv = setInterval(function () {
        circles.scan.setRadius(easeInOutExpo(t, 0, circles.range.getRadius(), circles.range.getRadius()));
        if (!circles.range.getMap() || t++ >= circles.range.getRadius()) t = 0;
    }, 50);
};

var circleTransition = function (marker, circle, action, callback) {
    if (action === 'open') openCircleTransition(marker, circle, callback);
    else if (action === 'close') closeCircleTransition(marker, circle, callback);
    else if (action === 'scan') scanCirclesTransition(marker, circle, callback);
};

var addSpawnMarker = function (location,info) {
    var marker = new google.maps.Marker({
        map: map,
        position: location,
        icon: icons.sighting,
        anchorPoint: new google.maps.Point(0,-16)
    });
    marker._pkmm_info=info;
    if (myLocationMarker && google.maps.geometry.spherical.computeDistanceBetween(myLocationMarker.getPosition(), location) < 200) {
        marker.setIcon(icons.sighting_near);
    }
    marker._pkmm_spawnCircle = addSpawnCircle(location);

    marker.addListener('dblclick', function () {
        windowTransition(location, Math.min(map.getZoom() + 2, 17));
    });
    marker.addListener('click', function () {
        removeNewSpawnMarker();
        if (marker._pkmm_spawnCircle.getMap()) {
            marker._pkmm_info.close();
            circleTransition(marker, marker._pkmm_spawnCircle, 'close', function () {
                if (myLocationMarker && google.maps.geometry.spherical.computeDistanceBetween(myLocationMarker.getPosition(), location) < 200) {
                    marker.setIcon(icons.sighting_near);
                }
                else {
                    marker.setIcon(icons.sighting);
                }
            });
            
        }
        else {
            windowTransition(location, 17, function () {
                if (myLocationMarker && google.maps.geometry.spherical.computeDistanceBetween(myLocationMarker.getPosition(), location) < 200) {
                    marker.setIcon(icons.sighting_near_active);
                }
                else {
                    marker.setIcon(icons.sighting_active);
                }
                circleTransition(marker, marker._pkmm_spawnCircle, 'open');
                marker._pkmm_info.open(map, marker);
            });
        }
    });
    spawnMarkers.push(marker);
};

var getPokemons = function (pokemons){
    for(var i=0;i<pokemons.length;i++){
        _pkmm_pokemons[pokemons[i].id]=pokemons[i];
    }
}

var createInfoElement = function(latitude,longitude) {
    var infoDiv = document.createElement('iframe');
    infoDiv.src=hostname + "/spawn#?latitude="+latitude+'&longitude='+longitude;
    infoDiv.style.border="none";
    return new google.maps.InfoWindow({ content: infoDiv, maxWidth:300});
}

var geocodeLatLng = function (latitude, longitude, callback) {
  geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location': {lat: +latitude, lng: +longitude}}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
          callback(null, results[0]);
      } else {
        callback('No results found', null);
      }
    } else {
      callback('Geocoder failed due to: ' + status, null);
    }
  });
};

var getDistance = function(origin, destination, callback){
    DistanceMatrixService = new google.maps.DistanceMatrixService();
    DistanceMatrixService.getDistanceMatrix(
    {
        origins: [origin],
        destinations: [destination],
        travelMode: 'WALKING'
    }, function(response, status){
        if (status == 'OK') {
            var res={};
            res.origin = response.originAddresses[0];
            res.destination = response.destinationAddresses[0];
            res.distance = response.rows[0].elements[0].distance.text;
            res.duration = response.rows[0].elements[0].duration.text;
            callback(null,res);
        }
        else callback('err',null);
    });
};
var addSpawnMarkers = function (spawns) {
    if (spawns) {
        for (var i = 0; i < spawns.length; i++) {
            var location = new google.maps.LatLng({ lat: spawns[i].latitude, lng: spawns[i].longitude });
            var info = createInfoElement(spawns[i].latitude,spawns[i].longitude);
            addSpawnMarker(location,info);
        }
    }
};
var addNewSpawnMarker = function(latitude, longitude){
    removeNewSpawnMarker();
    var location =new google.maps.LatLng({ lat: latitude, lng: longitude });
    newSpawnMarker = new google.maps.Marker({
        map: map,
        position: location,
        icon: icons.sighting_active,
        anchorPoint: new google.maps.Point(0,-16)
    });
    newSpawnMarker._pkmm_info = createInfoElement(latitude,longitude);
    newSpawnMarker._pkmm_info.open(map, newSpawnMarker);

    if (myLocationMarker && google.maps.geometry.spherical.computeDistanceBetween(myLocationMarker.getPosition(), location) < 200) {
        newSpawnMarker.setIcon(icons.sighting_near);
    }
    newSpawnMarker.addListener('click', function () {
        newSpawnMarker._pkmm_info.open(map, newSpawnMarker);
    });
    google.maps.event.addListener(newSpawnMarker._pkmm_info ,'closeclick',function(){
        removeNewSpawnMarker();
    });
}

var removeNewSpawnMarker = function() {
    if(requireUpdateSpawnMarkers){
        loadSpawnMarker(function(err,res){
            if(err){Materialize.toast('Error: ' + err, 2000);}
            else {
                removeSpawnMarkers();
                addSpawnMarkers(res);
                removeNewSpawnMarker();
            }
        });
        requireUpdateSpawnMarkers = false;
    }

    if(newSpawnMarker){
        newSpawnMarker._pkmm_info.close();
        newSpawnMarker._pkmm_info.setMap(null);
        newSpawnMarker._pkmm_info=null;
        newSpawnMarker.setMap(null);
        newSpawnMarker=null;
    }
}

var updateSpawnMarkers = function () {
    var length=spawnMarkers.length;
    for (var i = 0; i < length; i++) {
        addSpawnMarker(spawnMarkers[i].getPosition(),spawnMarkers[i]._pkmm_info);
        spawnMarkers[i].setMap(null);
        spawnMarkers[i]=null;
    }
    spawnMarkers = spawnMarkers.slice(length);
}

var removeSpawnMarkers = function () {
    for (var i = 0; i < spawnMarkers.length; i++) {
        spawnMarkers[i]._pkmm_spawnCircle.setMap(null);
        spawnMarkers[i]._pkmm_spawnCircle=null;
        spawnMarkers[i]._pkmm_info.close();
        spawnMarkers[i]._pkmm_info.setMap(null);
        spawnMarkers[i]._pkmm_info=null;
        spawnMarkers[i].setMap(null);
        spawnMarkers[i]=null;
    }
    spawnMarkers = [];
}

var addSpawnCircle = function (location) {
    var circle = new google.maps.Circle({
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: '#FFBBBB',
        fillOpacity: 0.2,
        map: null,
        center: location,
        radius: 200
    });
    return circle;
}

var addSightingCircles = function (location) {
    var circles = {};
    circles.scan = new google.maps.Circle({
        strokeColor: '#FFFFFF',
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: '#BBBBFF',
        fillOpacity: 0.2,
        map: null,
        center: location,
        radius: 200
    });
    circles.range = new google.maps.Circle({
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: '#FFFFFF',
        fillOpacity: 0,
        map: null,
        center: location,
        radius: 200
    });
    return circles;
}

var addMyLocationButton = function () {
    myLocationMarker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: map.getCenter(),
        icon: icons.myLocation
    });

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
    firstChild.title = 'My Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(/assets/images/map/currentLocationBtn.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'my_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function () {
        $('#my_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function () {
        var imgX = '0';
        var animationInterval = setInterval(function () {
            if (imgX == '-18') imgX = '0';
            else imgX = '-18';
            $('#my_location_img').css('background-position', imgX + 'px 0px');
        }, 500);
        if (navigator.geolocation) {
            Materialize.toast('Locating...', 2000);

            navigator.geolocation.getCurrentPosition(function (position) {
                var location = new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
                myLocationMarker.setPosition(location);
                myLocationMarker.setMap(map);
                if (myLocationMarker._pkmm_sightingCircles) {
                    if (myLocationMarker._pkmm_sightingCircles.range){
                        myLocationMarker._pkmm_sightingCircles.range.setMap(null);
                    }
                    if (myLocationMarker._pkmm_sightingCircles.scan){
                        myLocationMarker._pkmm_sightingCircles.scan.setMap(null);
                    }
                }
                myLocationMarker._pkmm_sightingCircles = addSightingCircles(location);
                windowTransition(location, 17, function () {
                    circleTransition(myLocationMarker, myLocationMarker._pkmm_sightingCircles.range, 'open', function () {
                        circleTransition(myLocationMarker, myLocationMarker._pkmm_sightingCircles, 'scan');
                        updateSpawnMarkers();
                    });
                });
                myLocationMarker.addListener('click', function () {
                    if (myLocationMarker._pkmm_sightingCircles.range.getMap()) {
                        circleTransition(myLocationMarker, myLocationMarker._pkmm_sightingCircles.range, 'close');
                    }
                    else {
                        circleTransition(myLocationMarker, myLocationMarker._pkmm_sightingCircles.range, 'open');
                    }
                });

                clearInterval(animationInterval);
                $('#my_location_img').css('background-position', '-144px 0px');
                Materialize.toast('Gotcha!', 2000);
            });
        }
        else {
            Materialize.toast('Failed to locate you.', 2000);
            clearInterval(animationInterval);
            $('#my_location_img').css('background-position', '0px 0px');
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
};

var mapInit = function () {
    var mapStyles = [{ "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "color": "#27bda2" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#a1f199" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "color": "#37bda2" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{ "color": "#37bda2" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.attraction", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "color": "#e4dfd9" }] }, { "featureType": "poi.business", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.government", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#37bda2" }, { "visibility": "on" }] }, { "featureType": "poi.place_of_worship", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.school", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#4f8c7b" }, { "visibility": "on" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "weight": "4.96" }, { "color": "#f8f98e" }, { "visibility": "on" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "weight": "1.00" }] }, { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#f8f98e" }] }, { "featureType": "road.highway.controlled_access", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#dce96e" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#dce96e" }] }, { "featureType": "road.local", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.station.bus", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#5ddad6" }] }];
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
        styles: mapStyles
    }
    var mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);
    addMyLocationButton();

    google.maps.event.addListener(map, "click", function(event){
        addNewSpawnMarker(event.latLng.lat(),event.latLng.lng());
    });
    return map;
};