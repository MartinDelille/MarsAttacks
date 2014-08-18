/**
 * Module to broke between sockets and other components. Returns a unique getInstance
 * function that will create the WebSocket only once.
 */
define(["socket.io"], function(io) {

    var socket = io.connect("/socket");;
    socket.on("connected", function (data) {
        console.log("Connected to the socket: " + JSON.stringify(data));
    });

    return {
      getInstance: function() {
        return socket;
      }
    };

});
