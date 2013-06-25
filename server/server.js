/**
 * We declare here our nodejs server, that will produce the REST api and connect onto the MongoDB instance
 * @version 1.0
 * @since 1.0
 * @author Julien Roche
 * 
 * @see http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
 * @see http://mongodb.github.io/node-mongodb-native/
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
     * Instance of the WebSocket server
     * @type {SocketIo}
     */
    socketIO = require("socket.io"),
    
    /**
     * Request instance
     * @link {Request}
     */
    request = require("request"),
    
    /**
     * Mongo instance to communicate with the MongoDB instance
     * @type {MongoDB}
     */
    mongo = require('mongodb'),
    
    /**
     * Express application instance
     * @type {Application}
     */
    app = express(),
    
    /**
     * Instance for the Mongo Server
     * @type {MongoServer}
     */
    mongoServer = mongo.Server("localhost", 27017, { auto_reconnect: true }),
    
    /**
     * Instance for ou database
     */
    database = new mongo.Db("marsAttack", mongoServer, { w: 1 }),

    Aliens = require('./aliens.js');
    
console.log("Open the database");
database.open(function(err){
    if(err){
        console.log("An error occured with the database")
        process.exit(1);
    }
    
    console.log("Database opened");
    console.log("Start to intialize our WebSocket server");
    
    // WebSocket Definition
    socketIO = socketIO.listen(1337);
    
    socketIO.sockets.on('connection', function (socket) {
        socket.emit("connected", { timestamp: Date.now(),  });
        
        /*client.on("message", function () {
        }) ;
        
        client.on("disconnect", function () {
        });*/
    });
    
    function broadCastToClients(messageName, jsonObjectOrArray) {
        socketIO.sockets.emit(messageName, jsonObjectOrArray);
    }
    
    console.log("WebSocket server is ready");
    console.log("Start to initialize our REST api");

    // REST api definition
    app.use(express.bodyParser()); // Set that we will use the Express parser (try to parse into JSON / form-url-encoded ...). See http://expressjs.com/api.html#bodyParser
    
    /**
     * Get a battle map
     */
    app.get("/backend/maps/:id", function(req, res) {
        console.log("A request is done on /maps/:id");
        database.collection("maps", function(err, collection) {
            if(err){
                res.send(400);
                return;
            }
            
            collection.find().toArray(function(err, items){
                if(err){
                    res.send(400);
                    return;
                }
                
                res.send(items);
            });
        });
    });
    
    /**
     * Get all towers
     */
    app.get("/backend/towers", function(req, res) {
        console.log("A request is done on /towers on GET");
        database.collection("towers", function(err, collection) {
            if(err){
                res.send(400);
                return;
            }
            
            collection.find({ }).toArray(function(err, items){
                if(err){
                    res.send(400);
                    return;
                }
                
                res.send(items);
            });
        });
    });
    
    /**
     * Put a new tower
     */
    app.post("/backend/towers", function(req, res) {
        console.log("A request is done on /towers on POST");
        
        if(!req.body) {
            res.send(400);
            return;
        }
        
        database.collection("towers", function(err, collection) {
            collection.insert(req.body, { safe:true }, function(err, result) {
                res.send(err ? 500 : result[0]);
                broadCastToClients('tower:add', { towerId: result[0]._id });
            });
        });
    });
    
    /**
     * Update a tower
     */
    app.post("/backend/towers/:id", function(req, res) {
        console.log("A request is done on /towers on POST");
        
        database.collection("towers", function(err, collection) {
            collection.update({ "_id": new mongo.BSONPure.ObjectID(id) }, req.body, { safe:true }, function(err, result) {
                res.send(err ? 500 : req.body);
            });
        });
    });
    

    app.get("/backend/towers/:id", function (req, res) {
        console.log("A request is done on /towers/:id on GET");
        database.collection("towers", function(err, collection) {
            if(err){
                res.send(400);
                return;
            }  
            collection.find().toArray(function(err, items){
                if(err){
                    res.send(400);
                    return;
                } 
                res.send(items);
            });
        });
    });


    /**
     * Remove a tower
     */
    app["delete"]("/backend/towers/:id", function(req, res) {
        console.log("A request is done on /towers on DELETE");
        
        database.collection("towers", function(err, collection) {
            collection.remove({ "_id": new mongo.BSONPure.ObjectID(req.params.id) }, { safe:true }, function(err, result) {
                res.send(err ? 500 : req.body);
                broadCastToClients('tower:delete', { towerId: req.params.id });
            });
        });
    });

    // aliens ---------------------------------------------------

    var TOWN_CENTER = { lat: 45.1667, lng: 5.7167 };

    /**
     * Create a random cloud of aliens in one of the 4th cardinal points.
     */
    app.post("/backend/aliens", function(req, res) {
        console.log("A request is done on /aliens on POST");
        database.collection("aliens", function(err, collection) {
            var aliens = Aliens.AlienFactory.createCloud(TOWN_CENTER);
            var results = [];
            for (var i=0; i<aliens.length; i++) {
                collection.insert(aliens, { safe:true }, function(err, result) {
                    if (err !== 500) {
                        broadCastToClients('aliens:add', aliens);
                        res.send(result);
                    }
                });                
            }
        });
    });

    /**
     * Get all aliens
     */
    app.get("/backend/aliens", function(req, res) {
        console.log("A request is done on /aliens on GET");
        database.collection("aliens", function(err, collection) {
            if(err){
                res.send(400);
                return;
            }
            
            collection.find({ }).toArray(function(err, items){
                if(err){
                    res.send(400);
                    return;
                }
                
                res.send(items);
            });
        });
    });

    app.get("/backend/aliens/moves/forward", function(req, res) {
        console.log("A request is done on /aliens/moves/forward on GET");
        database.collection("aliens", function(err, collection) {
            if(err) {
                res.send(400);
                return;
            }
            
            var result = [];
            var cursor = collection.find({ });
            cursor.each(function(s, doc) {
                if (doc != null && doc.lat != null && doc.lng != null) {
                    new Aliens.AlienMoves(doc).forwardTo(TOWN_CENTER);
                    result.push(doc);
                    collection.update({_id: doc._id}, { lat: doc.lat, lng: doc.lng }, function() {
                        broadCastToClients('aliens:move', [doc]);
                    });
                }
            });
            res.send();
        });
    });

    // cleanup ----------------------

    app.get("/backend/cleanup", function(req, res) {
        database.collection("aliens", function(err, collection) {
            collection.drop(function() {});
        });
        database.collection("towers", function(err, collection) {
            collection.drop(function() {});
        });

        broadCastToClients('towers:delete');
        broadCastToClients('aliens:delete');
        res.send("Done");
    });

    // And finally, run the server
    app.listen(8080);
    
    console.log("Server started on port 8080");
    
    // Start a CRON
    console.log("Now, we will start a cron timer !");
    setInterval(function() {
        console.log("Cron in action - move the aliens");
       request.get("http://localhost:8080/backend/aliens/moves/forward", { }, function(){
            console.log("Cron: aliens on the road !");
        });
        
    }, 1000 * 5); // 5 seconds
    
    setInterval(function() {
        console.log("Cron in action - add some aliens");
        request.post("http://localhost:8080/backend/aliens", { }, function(){
            console.log("Cron: aliens added !");
        });
        
    }, 1000 * 60 * 10); // 10 minutes
    
    setInterval(function() {
        console.log("Cron in action - remove some aliens");
        
        // Arbitraty remove some aliens !
        database.collection("aliens", function(err, collection) {
            if(err) {
                return;
            }
            
            collection.find({ }).toArray(function(err, aliens){
                if(err){
                    return;
                }
                
                var aliensToRemove = [];
                for(var i = aliens.length - 1; i >= 0; --i){
                    if(Math.round(Math.random())){
                        // We remove the alien !
                        aliensToRemove.push(aliens[i]);
                    }
                }
                
                broadCastToClients('aliens:delete', aliensToRemove);
            });
        });
        
    }, 1000 * 60 * 60); // 60 minutes
});
