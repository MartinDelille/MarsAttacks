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
      var self = this;
      var towerPinModel = new TowerPinModel();
      towerPinModel.getLocation(function(position){
        // complete here
        $.ajax({
          type : "PUT",
          url : self.endpoint,
          data : {latitude: position.coords.latitude , longitude : position.coords.longitude},
          success : function (jsonTower) {
            $(self).trigger('created',[jsonTower]);
          }
        });
        var towerPinView = new TowerPinView(towerPinModel);
        towerPinView.displayMarker();
      });
    }
  };

  var TowerPinModel = function() {
    this.position = null;
  };
  TowerPinModel.prototype = {
    getLocation: function(cb) {
      var x=document.getElementById("build-tower");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          cb(pos);
        });
      } else {
        x.innerHTML="Geolocation is not supported by this browser.";
      }
    }
  };

  var TowerPinView = function(position) {
    this.position = position;
  };
  TowerPinView.prototype = {
    displayMarker: function() {
      var googlePos = new google.maps.LatLng(this.position.latitude,this.position.longitude);
      var marker = new google.maps.Marker({
        position: googlePos,
        map: map
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
    },
    bind: function() {
      $("#build-tower").on('click',$.proxy(this.onBuildTower, this));
    },
    onBuildTower: function(e) {
      e.preventDefault();
      var newTower = new TowerModel();
      $(newTower).on('created', function (e,jsonTower) {
        var newViewTower = new TowerPinView(jsonTower);
        newViewTower.displayMarker();
      });
      newTower.create();
    }
  };

  return {
    init: function() {
      var towerView = new TowerView(new TowerModel());
      towerView.loadTowers();
      towerView.bind();
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


