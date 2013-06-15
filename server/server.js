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
     * Express application instance
     * @type {Application}
     */
    app = express(),
    
    towers = [
        {
            "id": 1,
            "latitude": 45.190918,
            "longitude": 5.712572,
            "accuracy": 10,
            "altitude": 300
        },
        {
            "id": 2,
            "latitude": 45.193918,
            "longitude": 5.714572,
            "accuracy": 10,
            "altitude": 300
        },
        {
            "id": 3,
            "latitude": 45.192918,
            "longitude": 5.713572,
            "accuracy": 10,
            "altitude": 300
        }
    ];

console.log("Start to initialize our REST api");

// REST api definition

app.use(express.bodyParser()); // Set that we will use the Express parser (try to parse into JSON / form-url-encoded ...). See http://expressjs.com/api.html#bodyParser

/**
 * Get a battle map
 */
app.get("/maps/:id", function(req, res) {
    console.log("A request is done on /maps/:id");
    res.send({
        "id": req.params.id,
        "name": "A default map",
        "creationDate": 1371313428754,
        "updateDate": 1371313428754,
        "towers": towers
    });
});

/**
 * Get all towers
 */
app.get("/towers", function(req, res) {
    console.log("A request is done on /towers on GET");
    res.send(towers);
});

/**
 * Delete all towers
 */
app["delete"]("/towers", function(req, res) {
    console.log("A request is done on /towers on DELETE");
    res.send(towers);
});

/**
 * Put a new tower
 */
app.put("/towers", function(req, res) {
    console.log("A request is done on /towers on PUT");
    
    if(!req.body) {
        res.send(400);
        return;
    }
    
    var tower = req.body;
    tower.id = Date.now();
    towers.push(tower);
    
    res.send(tower);
});

/**
 * Update a tower
 */
app.post("/towers/:id", function(req, res) {
    console.log("A request is done on /towers on POST");
    
    if(!req.body) {
        res.send(400);
        return;
    }
    
    var i;
    for(i = 0; i < towers.length; ++i) {
        if(towers[i].id === req.params.id) {
            towers[i] = req.body;
            break;
        }
    }
    
    res.send(req.body);
});

/**
 * Remove a tower
 */
app["delete"]("/towers/:id", function(req, res) {
    console.log("A request is done on /towers on DELETE");
    
    var i, tower;
    for(i = 0; i < towers.length; ++i) {
        if(towers[i].id == req.params.id) {
            tower = towers[i];
            towers.splice(i, 1);
            break;
        }
    }
    
    res.send(tower);
});

// And finally, run the server
app.listen(8080);

console.log("Server started on port 8080");