define(
    ["backbone", "js/app/models/SocketBroker"], 
    function(Backbone, SocketBroker) {

    // define alien and its collection

    var Alien = Backbone.Model.extend({
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
        }
    });

    return {
        collection : Aliens,
        model      : Alien
    };

});