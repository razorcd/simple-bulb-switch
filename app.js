/**
 * Module dependencies.
 */

var template_engine = 'ejs',
    domain = 'localhost';

var express = require('express'),
    engine = require('ejs-locals'),
    http = require('http'),
    store = new express.session.MemoryStore,
    path = require('path');

var app = express();

app.engine('ejs', engine)

app.configure(function() {

    app.set('template_engine', 'ejs');
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', template_engine);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    //middleware
    app.use(function(req, res, next) {
        if (req.session.user) {
            req.session.logged_in = true;
        }
        res.locals.message = req.flash();
        res.locals.session = req.session;
        res.locals.q = req.body;
        res.locals.err = false;
        next();
    });

});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.locals.inspect = require('util').inspect;


var configs = new Map(); //database





app.post("/configs", function(req,res) {
    let name = req.body["name"];
    
    if (!name) { 
        res.status(400);
        res.end();
        return;
    }

    putConfigByName(name, req.body);
    res.status(201);
    res.end();
});

app.put("/configs/:name", function(req,res) {
    let name = req.body["name"];
    var foundConfig = getConfigByName(req.params["name"]);
    
    if (!foundConfig) { 
        res.status(404);
        res.end();
        return;
    }

    putConfigByName(name, req.body);
    res.status(201);
    res.end();
});

app.get("/configs", function(req,res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getConfigs()));
});

app.get("/configs/:name", function(req,res) {
    var foundConfig = getConfigByName(req.params["name"]);
    if (foundConfig) {
        res.end(JSON.stringify(foundConfig));
        return;
    }
    res.status(404);
    res.end(null);
});

app.delete("/configs/:name", function(req,res) {
    var foundConfig = getConfigByName(req.params["name"]);
    if (foundConfig) {
        deleteConfigByName(req.params["name"]);
        res.status(202);
        res.end(null);
        return;
    }
    res.status(404);
    res.end(null);
});

app.get("/search?", function(req,res) {
    let name = req.query.name;
    let data = {};

    for (const key in req.query) {
        let split = key.split(".");
        if (split[0] === "data") {data[split[1]] = req.query[key]}
    }

    let foundConfigs = searchByNameAndDate(name, data);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(foundConfigs));
});



http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});



function getConfigs() {
    console.log("configs:", configs);
    return configs.values();
}

function getConfigByName(name) {
    return configs.get(name);
}

function putConfigByName(name, config) {
    configs.set(name, config);
}

function deleteConfigByName(name) {
    configs.delete(name);
}

function searchByNameAndDate(name, data) {
    let foundConfigs = [];

    configs.forEach((configValue, nameKey) => {
        if (name === nameKey && containsSubObject(configValue, data)) {
            foundConfigs.push(configValue);
        }
    });

    return foundConfigs;
}

function containsSubObject(object, subObject) {
    let match = true;
    Object.keys(subObject).forEach(key => {
        if (object[key] !== subObject[key]) {match = false};
    });
    return match;
}