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
    },
    create: function() {
      var towerPinModel = new TowerPinModel();
      position = towerPinModel.getLocation();
      // complete here
      $.ajax({
        type : "POST",
        url : this.endpoint,
        data : {latitude: position.coords.latitude , longitude : position.coords.longitude},
        success : function (jsonTower) {
          $(self).trigger('created',[jsonTower]);
        }
      });
      var towerPinView = new TowerPinView(towerPinModel)
      towerPinView.displayMarker()
    }
  };

  var TowerPinModel = function() {
    this.endpoint = 'http://10.0.0.104:8080/towers';
    this.position = null;
  };
  TowerPinModel.prototype = {
    getLocation: function() {
      var x=document.getElementById("build-button");
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition();
      } else {
        x.innerHTML="Geolocation is not supported by this browser.";
      }
    }
  };

  var TowerPinView = function(model) {
    this.model = model;
  };
  TowerPinView.prototype = {
    displayMarker: function() {
      var position = this.model.position;
      var googlePos = new google.maps.LatLng();
      var marker = new google.maps.Marker({
        position: googlePos,
        map: map,
    }
  }

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
      for (var i=0; i<this.model.towers.length; i++) {
        var tower = this.model.towers[i];
        var marker = new google.maps.Marker({
          position:  new google.maps.LatLng(tower.latitude, tower.longitude),
          map: map
        });
        this.towerPins.push(marker);        
      }
    },
    bind: function() {
      
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

  
