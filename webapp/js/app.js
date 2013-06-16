/**
 * Module to manager towers on the map.
 */

var map;

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
          data : {latitude: position.coords.latitude , longitude : position.coords.longitude, life : 100},
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

  var TowerPinView = function(jsonTower) {
    this.jsonTower = jsonTower;
  };
  TowerPinView.prototype = {
    displayMarker: function() {
      var self = this;
      var iconTower = 'img/tower.png';
      var googlePos = new google.maps.LatLng(self.jsonTower.latitude,self.jsonTower.longitude);
      var marker = new google.maps.Marker({
        position: googlePos,
        map: map,
        icon: iconTower
      });
      marker.towerModel = self.jsonTower;
      // console.log(marker);
      google.maps.event.addListener(marker, 'click', function() {
        TowerWindowInfo.display(marker);
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
      for (var i=0; i<this.model.towers.length; i++) {
        var tower = this.model.towers[i];
        modelPinView = new TowerPinView(tower);
        modelPinView.displayMarker();
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


var TowerWindowInfo = (function() {

  var TowerWindowInfoModel = function() {
    this.endpoint = 'http://10.0.0.104:8080/towers';
  };

  TowerWindowInfoModel.prototype = {
    getNumberOfLives: function(idMarker){
      var self = this;
      $.get(this.endpoint+":"+idMarker, function(result) {
        return result.lives;
        // $(self).trigger('livesLoaded');
      });
    },
    setMessageToDisplay: function(message){
      var self = this;
      var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Tower</h1>'+
      '<div id="bodyContent">'+
      '<p>'+
      message +
      ' lives </p>' +
      '</div>'+
      '</div>';
      return contentString;
    }
  };

  var TowerWindowInfoView = function(message) {
    this.message = message;
  };

  TowerWindowInfoView.prototype = {
    display: function(marker){
      var infowindow = new google.maps.InfoWindow({
        content: this.message
      });
      infowindow.open(map,marker);
      google.maps.event.addListener(infowindow,'closeclick',function(){
        alert("I am close");
      });
    }
  };

  return {
    display: function(marker) {
      console.log(marker.towerModel);
      var windowModel = new TowerWindowInfoModel();
      var lives = marker.towerModel.life;
      var windowInfo = new TowerWindowInfoView(windowModel.setMessageToDisplay(lives));
      windowInfo.display(marker);
    }
  };

})();







var GRENOBLE_LAT_LNG = new google.maps.LatLng(45.1667, 5.7167);

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


