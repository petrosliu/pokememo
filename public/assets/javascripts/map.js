var map = {};

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
    'myLocation': {
        url: '/assets/images/map/currentLocation.png',
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
        scaledSize: new google.maps.Size(24, 24)
    }
};

var linearTween = function (t, b, c, d) {
    return c*t/d + b;
};
var easeInExpo = function (t, b, c, d) {
    return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};
var easeOutExpo = function (t, b, c, d) {
    return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};
var easeInOutExpo = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
    t--;
    return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};

var windowTransition = function (location, zoom) {
    var startLat = map.getCenter().lat();
    var startLng = map.getCenter().lng();
    var startZoom = map.getZoom();
    var times = 20;
    var t=0;

    var itv = setInterval(function () {
        if(zoom>startZoom){
            map.setCenter({lat:easeOutExpo(t,startLat,location.lat-startLat,times),lng:easeOutExpo(t,startLng,location.lng-startLng,times)});
            map.setZoom(Math.round(easeInExpo(t,startZoom,zoom-startZoom,times)));
        }
        else if (zoom<startZoom){
            map.setCenter({lat:easeInExpo(t,startLat,location.lat-startLat,times),lng:easeInExpo(t,startLng,location.lng-startLng,times)});
            map.setZoom(Math.round(easeOutExpo(t,startZoom,zoom-startZoom,times)));
        }
        else map.setCenter({lat:easeInOutExpo(t,startLat,location.lat-startLat,times),lng:easeInOutExpo(t,startLng,location.lng-startLng,times)});
        
        if (t++>=times) {
            map.setCenter(location);
            map.setZoom(zoom);
            window.clearInterval(itv);
        }
    }, 5);
}

var openSpawnTransition = function(marker){
    var circle=marker.spawnCircle;
    var radius= circle.getRadius();
    circle.setRadius(0);
    circle.setMap(map);
    marker.setIcon(icons.sighting_active);
    var times = 20;
    var t=0;
    var itv = setInterval(function () {
        circle.setRadius(easeInOutExpo(t,0,radius,times));
        if(t++>=times){
            circle.setRadius(radius);
            window.clearInterval(itv);
        }
    }, 5);
}

var closeSpawnTransition = function(marker){
    var circle=marker.spawnCircle;
    var radius= circle.getRadius();
    var times = 20;
    var t=0;
    var itv = setInterval(function () {
        circle.setRadius(easeInOutExpo(t,radius,-radius,times));
        if(t++>=times){
            circle.setMap(null);
            circle.setRadius(radius);
            marker.setIcon(icons.sighting);
            window.clearInterval(itv);
        }
    }, 5);
}

var addSightingMarker = function (location) {
    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: location,
        icon: icons.sighting
    });
    marker.spawnCircle = addSpawnCircle(location);

    marker.addListener('dblclick', function () {
        windowTransition(location,Math.min(map.getZoom()+2,17));
    });
    marker.addListener('click', function () {
        if(marker.spawnCircle.getMap()){
            closeSpawnTransition(marker);
        }
        else{
            windowTransition(location,17);
            openSpawnTransition(marker);
        }
    });
};

var addSpawnCircle = function(location){
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

var addSightingCircle = function(location){
    var circle = new google.maps.Circle({
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: '#BBBBFF',
      fillOpacity: 0.2,
      map: map,
      center: location,
      radius: 200
    });
    return circle;
}

var addMyLocationButton = function () {
    var marker = new google.maps.Marker({
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
                var location={lat: position.coords.latitude, lng: position.coords.longitude};
                marker.setPosition(location);
                marker.setMap(map);
                windowTransition(location,17);
                marker.sightingCircle = addSightingCircle(location);
                marker.addListener('click', function () {
                    if(marker.sightingCircle.getMap()) marker.sightingCircle.setMap(null);
                    else marker.sightingCircle.setMap(map);
                });

                clearInterval(animationInterval);
                $('#my_location_img').css('background-position', '-144px 0px');
                Materialize.toast('Done.', 2000);
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



    var locations = [
        [37.559233, -121.968424],
        [37.557470, -121.968200],
        [37.558296, -121.967140],
        [37.557563, -121.966828],
        [37.557063, -121.968160]
    ];

    for (var i = 0; i < locations.length; i++) {
        addSightingMarker({lat: locations[i][0], lng: locations[i][1]});
    }


    return map;
};