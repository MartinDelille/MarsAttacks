/**
 * We declare here our nodejs server, that will produce the REST api and connect onto the MongoDB instance
 * @version 1.0
 * @since 1.0
 * @author Julien Roche
 * 
 * @see http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
 */

console.log("Start to initialize our server");

// First, load required modules
var 
    /**
     * Express instance to have some tools to produce easily our REST api
     * @type {Express}
     */
    express = require("express"),
    
    /**
     * MongoDB instance to connect on the MongoDB database instance
     * @type {MongoDB}
     */
    //mongo = require("mongodb"),
    
    /**
     * Express application instance
     * @type {Application}
     */
    app = express();


console.log("Start to initialize our REST api");

// REST api definition
/**
 * List all stored scenarii
 */
app.get("scenarii", function(req, res) {
    res.send([{ name: "Basic scenario name" }]);
});
 
// And finally, run the server
app.listen(8080);

console.log("Server started on port 8080");