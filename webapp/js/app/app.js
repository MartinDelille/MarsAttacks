define(
  ["underscore", "backbone", "jquery", "gmaps", "js/app/models/TowerModel", "js/app/models/AlienModel"], 
  function(_, Backbone, $, google, TowerModel, AlienModel) {

  var GRENOBLE_LAT_LNG = new google.maps.LatLng(45.1667, 5.7167);

  // extension of Marker to handle some specific stuff

  /**
   * Handles a collection of models to be drawn on the map.
   */
  var MapLayerCollectionView = Backbone.View.extend({

    // markerConfig: the object to configurate the desired rendered marker
    markerConfig: {},

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
      var position = new google.maps.LatLng(coords.latitude, coords.longitude);
      var markerOpts = _.extend({}, {
        position: position,
        map: this.map
      }, this.markerConfig);
      var marker = new google.maps.Marker(markerOpts);
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
    markerConfig: { icon: "img/tower.png" },

    infoTemplate: _.template("<div id=\"content\"><div id=\"siteNotice\"></div>"
      + "<h1 id=\"firstHeading\" class=\"firstHeading\">Tower</h1>"
      + "<div id=\"bodyContent\"><p><%= message %></p></div></div>"),

    initialize: function() {
      MapLayerCollectionView.prototype.initialize.apply(this, arguments);
      this.on('marker:drawn', this.onMarkerDrawn, this);
    },

    onMarkerDrawn: function(model, marker) {
      var self = this;
      google.maps.event.addListener(marker, 'click', function() {
        new google.maps.InfoWindow({
          content: self.infoTemplate({ message: model.get('life') })
        }).open(self.map, marker);
      });
    }
  });

  /**
   * Defines the aliens layer view.
   */
  var AliensLayerView = MapLayerCollectionView.extend({
    markerConfig: { icon: "img/ufo.png" },

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
        var position = new google.maps.LatLng(coords.latitude, coords.longitude);
        marker.setPosition(position);
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
    el: '#map-canvas',

    initialize: function() {
    },

    render: function() {
      this.renderMap();
      // wait for for the map to be fully loaded to load layers
      google.maps.event.addListenerOnce(this.map, 'idle', $.proxy(function() {
        this.towersLayer = new TowersLayerView({ el: this.el, map: this.map, collection: this.options.towers });
        this.aliensLayer = new AliensLayerView({ el: this.el, map: this.map, collection: this.options.aliens });
        this.towersLayer.render();
        this.aliensLayer.render();
      }, this));
    },

    renderMap: function() {
      var mapOptions = {
        zoom: 8,
        center: GRENOBLE_LAT_LNG,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.el, mapOptions);
      this.map.setZoom(13);
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
