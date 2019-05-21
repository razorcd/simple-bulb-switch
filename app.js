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

var configs = [];

app.engine('ejs', engine)


app.configure(function() {

    app.set('template_engine', 'ejs');
    // app.set('domain', domain);
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', template_engine);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    // app.use(express.cookieParser('wigglybits'));
    // app.use(express.session({
    //     secret: 'whatever',
    //     store: store
    // }));
    // app.use(express.session());
    app.use(app.router);
    // app.use(require('less-middleware')(__dirname + '/public'));
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

var theState = "OFF";

app.get('/', function(req, res) {
    var template_engine = req.app.settings.template_engine;
    res.locals.session = req.session;
    res.render('index', {
        // title: 'Express with ' + template_engine
        title: "App",
        state: theState
    });
});

app.get("/state", function(req, res) {
    res.send(theState);
})
app.get("/stateOn", function(req, res) {
    theState = "ON";
    res.send("State set to ON   ");        
})
app.get("/stateOff", function(req, res) {
    theState = "OFF";
    res.send("State set to OFF");    
})





app.post("/configs", function(req,res) {
    console.log(req.body);
    configs.push(req.body);
    res.status(201);
    res.end();
});

app.get("/configs", function(req,res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(configs));
});

app.get("/configs/:name", function(req,res) {
    var name = req.params["name"];
    var foundConfig = configs.filter((config) => { 
         return config["name"] === name;
      }).forEach((v,i) => {
        res.end(JSON.stringify(v));
      });

      res.status(404);
      res.end(null);
});


http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
