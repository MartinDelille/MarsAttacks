/**
 * Module to manager towers on the map.
 */
var TowerMap = (function() {

	var TowerModel = function() {
		this.endpoint = 'http://10.0.0.104:8080/towers';
		this.towers = null;
	};
	TowerModel.prototype = {
		/**
		 * Loads tower data.
		 */
		load: function() {
			var self = this;
			$.get(this.endpoint, function(towerArray) {
				self.towers = towerArray;
				$(self).trigger('loaded');
			});
		}
	};

	var TowerView = function(model) {
		this.model = model;
	};
	TowerView.prototype = {
		loadTowers: function() {
			$(this.model).on('loaded', $.proxy(this.draw, this));
			this.model.load();
			this.towerPins = [];
		},
		draw: function() {
			var iconTower = 'img/tower.png';
			for (var i=0; i<this.model.towers.length; i++) {
				var tower = this.model.towers[i];
				var marker = new google.maps.Marker({
					position:  new google.maps.LatLng(tower.latitude, tower.longitude),
					map: map,
					icon: iconTower
				});
				this.towerPins.push(marker);				
			}
		}
	};

	return {
		init: function() {
			var towerView = new TowerView(new TowerModel());
			towerView.loadTowers();
		}
	};

})();

var GRENOBLE_LAT_LNG = new google.maps.LatLng(45.1667, 5.7167);

var map;
function initialize() {
  var mapOptions = {
    zoom: 8,
    center: GRENOBLE_LAT_LNG,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // load towers on map
  TowerMap.init();
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
