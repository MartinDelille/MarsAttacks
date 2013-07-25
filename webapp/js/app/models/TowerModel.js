define(
    ["backbone", "js/app/models/SocketBroker"], 
    function(Backbone, SocketBroker) {

    // define tower and its collection

    var Tower = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: '/backend/towers'
    });

    var Towers = Backbone.Collection.extend({
        url: '/backend/towers',
        model: Tower

    });

    return {
        collection : Towers,
        model      : Tower
    };

});