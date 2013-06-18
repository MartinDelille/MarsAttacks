define(
    ["backbone"], 
    function(Backbone) {

    // define tower and its collection

    var Tower = Backbone.Model.extend({
        url: '/backend/towers'
    });

    var Towers = Backbone.Collection.extend({
        baseUrl: '/backend/towers',
        model: Tower
    });

    return {
        colletion : Towers,
        model     : Tower
    };

});