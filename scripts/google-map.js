// 'use strict';

var mapElement = document.getElementById('map');
var loadEvent = document.getElementById('map-div');

function initialize() {
  console.log('initializing map...');
  var input = document.getElementById('whereAddressPending');
  var autocomplete = new google.maps.places.Autocomplete(input);
}

var initAutocomplete = function() {
  // google.maps.event.addDomListener(window, 'load', initialize);
  google.maps.event.addDomListener(window, 'resize', initialize);
  console.log("doing autocomplete...");
  var map = new google.maps.Map(mapElement, {
    center: {lat: 32.7303, lng: -117.14256},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // map.addListener('tilesloaded', initialize);
  map.addListener(loadEvent, 'click', initialize);
  // map.addListener(window, 'resize', initialize);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('whereAddressPending');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
