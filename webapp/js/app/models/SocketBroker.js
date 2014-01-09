/**
 * Module to broke between sockets and other components. Returns a unique getInstance
 * function that will create the WebSocket only once.
 */
define(["socket.io"], function(io) {

    var socket = io.connect("http://www.marsattacks.me:1337");;
    socket.on("connected", function (data) {
        console.log("We are connected: " + JSON.stringify(data));
    });

    return {
      getInstance: function() {
        return socket;
      }
    };    

});