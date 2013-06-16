module.exports = (function() {

	var NUMBER_OF_ALIENS_IN_CLOUD = 4;

	var AlienMaker = function() {};
	AlienMaker.prototype = {
		create: function(centerLatLng) {
			var refAlien = { lat: centerLatLng.lat-0.1, lng: centerLatLng.lng-0.1, life: 10 };
			// one degress aproximates to 110 km
			var oneMeterOffset = 1 / 110000;
			var aliens = [refAlien];
			for (var i=1; i<NUMBER_OF_ALIENS_IN_CLOUD; i++) {
				// offsetting with 3Kms
				var offsetLat = refAlien.lat - Math.random() * 3000 * oneMeterOffset;
				var offsetLng = refAlien.lng - Math.random() * 3000 * oneMeterOffset;
				aliens.push({ lat: offsetLat, lng: offsetLng, life: 10 });
			}
			return aliens;
		}
	};

	return new AlienMaker();

})();