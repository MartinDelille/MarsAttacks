define(
    ["backbone", "js/app/models/SocketBroker"], 
    function(Backbone, SocketBroker) {

    // define alien and its collection

    var Alien = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: '/backend/aliens'
    });

    var Aliens = Backbone.Collection.extend({
        url: '/backend/aliens',
        model: Alien,

        initialize: function() {
            var self = this;
            SocketBroker.getInstance().on("aliens:add", function(aliensData) {
                console.log("Aliens added", aliensData);
                self.add(aliensData);
            });
            SocketBroker.getInstance().on("aliens:move", function(aliensData) {
                console.log("Aliens moved", aliensData);
                self.set(aliensData, { remove: false });
                self.trigger("change:coords");
            });
        }
    });

    return {
        collection : Aliens,
        model      : Alien
    };

});