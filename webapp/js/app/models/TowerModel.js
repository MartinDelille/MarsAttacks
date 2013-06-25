define(
    ["backbone"], 
    function(Backbone) {

    // define tower and its collection

    var Tower = Backbone.Model.extend({
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