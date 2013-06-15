/**
 * Module to manager towers on the map.
 */
var TowerMap = (function() {

	var TowerModel = function() {
		this.endpoint = 'http://192.168.1.101:8080/towers';
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
			console.log(this.model);
			var marker = new google.maps.Marker({
				position:  new google.maps.LatLng(45.1667, 5.7167),
				map: map,
				title: 'Tower 1'
			});
			this.towerPins.push(marker);
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
google.maps.event.addDomListener(window, 'load', initialize);
