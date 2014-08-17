define(
  ["underscore", "backbone", "jquery", "js/app/models/TowerModel", "js/app/models/AlienModel"],
  function(_, Backbone, $, TowerModel, AlienModel) {

  var GRENOBLE_LAT_LNG = new L.LatLng(45.1667, 5.7167);

  // extension of Marker to handle some specific stuff

  /**
   * Handles a collection of models to be drawn on the map.
   */
  var MapLayerCollectionView = Backbone.View.extend({

    // markerIcon: the icon to render the marker with
    markerIcon: L.icon({}),

    initialize: function(options) {
      if (!_.has(options, "map")) {
        throw "The map instance must be defined";
      }
      this.map = options.map;
      this.collection.on("add", this.onModelAdded, this);
      // store markers by model id
      this.markersById = {};
    },

    /**
     * Called when a model is added, the given model is assumed to have
     * the proper 'latitude' and 'longitude' data.
     *
     * If it's not the case, override the determineCoords method.
     */
    onModelAdded: function(model) {
      this.drawModel(model);
    },

    drawModel: function(model) {
      var coords = this.determineCoords(model);
      var position = new L.LatLng(coords.latitude, coords.longitude);
      var marker = L.marker(position, {icon: this.markerIcon}).addTo(this.map);
      this.markersById[model.get('_id')] = marker;
      this.trigger('marker:drawn', model, marker);
    },

    render: function() {
      var self = this;
      this.collection.each(function(model) {
        self.drawModel(model);
      });
    },

    determineCoords: function(model) {
      return {
        latitude: model.get('latitude'),
        longitude: model.get('longitude')
      }
    }

  });

  /**
   * Defines the towers layer view.
   */
  var TowersLayerView = MapLayerCollectionView.extend({
    markerIcon: L.icon({
    	iconUrl: "img/tower.png",
		iconSize: [46, 46],
		iconAnchor: [23, 23],
	}),

    infoTemplate: _.template("<div id=\"content\"><div id=\"siteNotice\"></div>"
      + "<h1 id=\"firstHeading\" class=\"firstHeading\">Tower</h1>"
      + "<div id=\"bodyContent\"><p><%= message %></p></div></div>"),

    initialize: function() {
      MapLayerCollectionView.prototype.initialize.apply(this, arguments);
      this.on('marker:drawn', this.onMarkerDrawn, this);
    },

    onMarkerDrawn: function(model, marker) {
      var self = this;
      marker.bindPopup(
      	self.infoTemplate({ message: model.get('life') })
      );
    }
  });

  /**
   * Defines the aliens layer view.
   */
  var AliensLayerView = MapLayerCollectionView.extend({
    markerIcon: L.icon({
    	iconUrl: "img/ufo.png",
		iconSize: [32, 32],
		iconAnchor: [16, 16],
	}),

    initialize: function() {
      MapLayerCollectionView.prototype.initialize.apply(this, arguments);
      this.collection.on('change:coords', this.onCoordsChanged, this);
    },

    modelEvents: {
      'change:coords': 'onCoordsChanged'
    },

    // TODO lat,lng must be consistent with tower's attributes
    determineCoords: function(model) {
      return {
        latitude: model.get('lat'),
        longitude: model.get('lng')
      }
    },

    onCoordsChanged: function() {
      this.collection.each($.proxy(this.changeCoord, this));
    },

    changeCoord: function(alien) {
      // moving alien's marker, if there's any one
      if (alien.get('_id') in this.markersById) {
        var marker = this.markersById[alien.get('_id')];
        var coords = this.determineCoords(alien);
        var position = new L.LatLng(coords.latitude, coords.longitude);
        marker.setLatLng(position);
      } else {
        // adding a new alien
        this.drawModel(alien);
      }
    }

  });

  /**
   * High-level view to control the whole map.
   */
  var MapView = Backbone.View.extend({

    initialize: function() {
    },

    render: function() {
      this.renderMap();

      this.towersLayer = new TowersLayerView({ map: this.map, collection: this.options.towers });
      this.aliensLayer = new AliensLayerView({ map: this.map, collection: this.options.aliens });
      this.towersLayer.render();
      this.aliensLayer.render();
    },

    renderMap: function() {
    	this.map = L.map('map-canvas');
		// create the tile layer with correct attribution
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data © OpenStreetMap contributors';
		var osm = new L.TileLayer(osmUrl, {minZoom: 3, maxZoom: 18, attribution: osmAttrib});

		// start the map in Grenoble:
		this.map.setView(GRENOBLE_LAT_LNG, 2);
		this.map.addLayer(osm);

      if (navigator.geolocation) {
        console.log("Navigator has geolocalisation");
        var self = this;

        function successCallback(position) {
            console.log("Current position: " + position.coords.latitude + "/" + position.coords.longitude);
            var lPos = new L.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setView(lPos, 13);
            $("#build-tower").addClass("build-tower-active");
        }

        function errorCallback(error) {
          console.log("ERROR(" + error.code + "): " + error.message);
        }

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
			}
      else
        console.log("Navigator has no geolocalisation");
    }

  });

  /**
   * View to control the action buttons.
   */
  var ActionControlsView = Backbone.View.extend({
    el: '#controls',

    events: {
      'click #build-tower': 'onAddTowerClick'
    },

    onAddTowerClick: function() {
      // locating client
      if (navigator.geolocation) {
        var self = this;
        navigator.geolocation.getCurrentPosition(function(position) {
          // adding a tower
          self.collection.create({
            latitude: position.coords.latitude , longitude : position.coords.longitude, life : 100
          });
        });
      }
    }

  });

  return {
    init: function() {
      var towers = new TowerModel.collection();
      var aliens = new AlienModel.collection();
      var mapView = new MapView({
        towers: towers,
        aliens: aliens
      }).render();
      var actionControls = new ActionControlsView({ collection: towers });
      towers.fetch();
      aliens.fetch();
    }
  }

});
