module.exports = (function() {

	var NUMBER_OF_ALIENS_IN_CLOUD = 4;
	// min dist regarding the center of the town (in m)
	var DISTANCE_OUT_OF_CENTER = 10000;
	// one degress aproximates to 110 km
	var METER_OFFSET = 1 / 110000;

	var AlienFactory = function() {};
	AlienFactory.prototype = {
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

	return new AlienFactory();

})();