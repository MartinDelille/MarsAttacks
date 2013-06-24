var _ = require("underscore");

module.exports = (function() {

	// some math utility
	var MathUtility = {
		toRad: function(number) {
			return number * Math.PI / 180;
		},
		dist: function(latlng1, latlng2) {
			var lat1 = latlng1.lat,
				lat2 = latlng2.lat,
				lng1 = latlng1.lng,
				lng2 = latlng2.lng;

			var R = 6371; // km
			var dLat = this.toRad(lat2-lat1);
			var dLon = this.toRad(lng2-lng1);
			var lat1 = this.toRad(lat1);
			var lat2 = this.toRad(lat2);

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;

			return d;
		},
		latDiff: function(latlng1, latlng2) {
			var p1 = _.clone(latlng1);
			var p2 = _.clone(latlng2);
			p2.lng = p1.lng;
			return this.dist(p1, p2);
		},
		lngDiff: function(latlng1, latlng2) {
			var p1 = _.clone(latlng1);
			var p2 = _.clone(latlng2);
			p2.lat = p1.lat;
			return this.dist(p1, p2);
		}
	};

	var NUMBER_OF_ALIENS_IN_CLOUD = 4;
	// min dist regarding the center of the town (in m)
	var DISTANCE_OUT_OF_CENTER = 10000;
	// one degress aproximates to 110 km
	var METER_OFFSET = 1 / 110000;

	var AlienFactory = function() {};
	AlienFactory.prototype = {
		/**
		 * Creates a bunch of aliens based on the given center coordinates.
		 */
		createCloud: function(centerLatLng) {
			var refAlien = { lat: centerLatLng.lat-METER_OFFSET*DISTANCE_OUT_OF_CENTER, lng: centerLatLng.lng-METER_OFFSET*DISTANCE_OUT_OF_CENTER, life: 10 };
			var aliens = [refAlien];
			for (var i=1; i<NUMBER_OF_ALIENS_IN_CLOUD; i++) {
				// offsetting with 3Kms
				var offsetLat = refAlien.lat - Math.random() * 3000 * METER_OFFSET;
				var offsetLng = refAlien.lng - Math.random() * 3000 * METER_OFFSET;
				aliens.push({ lat: offsetLat, lng: offsetLng, life: 10 });
			}
			return aliens;
		}
	};

	var MOVE_FORWARD_METERS = 1000;

	/**
	 * Object to manipulate alien movements.
	 */
	var AlienMoves = function(alien) { 
		this.alien = alien; 
	};
	AlienMoves.prototype = {
		forwardTo: function(destinationLatLng) {
			// computing destination between alien and target point (in meters)
			var globalDistance = MathUtility.dist(this.alien, destinationLatLng);
			var globalLat = MathUtility.latDiff(this.alien, destinationLatLng);
			var globalLng = MathUtility.lngDiff(this.alien, destinationLatLng);
			// getting the offset for both lng and lat, to calculate the new point where the alien will fly
			var latOffset = globalLat * MOVE_FORWARD_METERS / globalDistance;
			var lngOffset = globalLng * MOVE_FORWARD_METERS / globalDistance;
			this.alien.lat += latOffset * METER_OFFSET;
			this.alien.lng += lngOffset * METER_OFFSET;
			console.log(this.alien);
		}
	};

	return {
		AlienFactory: new AlienFactory(),
		AlienMoves: AlienMoves
	} 

})();