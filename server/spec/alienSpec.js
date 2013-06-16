var aliensMaker = require('../aliens.js');
var _ = require('underscore');

describe("Aliens, when creating ships", function() {

	it("Creates 4 aliens among one of the 4 cardinal points", function() {
		console.log(_);
		var aliens = aliensMaker.create({ lat: 45.1667, lng: 5.7167 });
		expect(aliens.length).toBe(4);
	});

	it("Determines their position at +10km of the given center", function() {

	});

});