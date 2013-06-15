var map;
function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


// add a pin on current location
function addPin(position)
{
  var googlePos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  var mapOptions = {
    zoom: 4,
    center: googlePos,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var marker = new google.maps.Marker({
      position: googlePos,
      map: map,
      title: 'Hello World!'
  });
}


// fonction to get latitude et longitude
var x=document.getElementById("build-button");
function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(addPin);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }

function showPosition(position)
  {
  x.innerHTML="Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;  
  }