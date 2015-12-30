var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var token = require('./modules/token');

var gs = require('./modules/global_settings');

var cloudant_proxy = require('./routes/cloudant_proxy.js');

var methodOverride = require('method-override');

var app = express();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(methodOverride());

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

var whitelist = ['http://127.0.0.1'];
var corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'OPTIONS']
};


var allowCrossDomain = function(req, res, next) {
  console.log('Request origin %s', req.headers.origin);
  //res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Origin', 'null');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  console.log('filter: applying filter on %s', req.path);

  if (req.path == '/login' || req.path == '/signup' || req.path == '/verify' ||
    req.path == '/loginFB' || req.path == '/forgot' || req.path.indexOf('/images/') == 0 ||
    req.path.indexOf('/db/') == 0) {
    console.log('Path allowed %s', req.path);
    next();
  } else {
    console.log('Path disallowed %s', req.path);
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      var bearer = bearerHeader.split(" ");
      bearerToken = bearer[1];

      if (token.hasTokenInCache(bearerToken)) {
        next();
      } else {
        res.send(403);
      }
    } else {
      console.log('filter: no headers supplied...');
      res.send(403);
    }
  }
});

//app.use(cloudant_proxy(/\/db\/(.*)/, gs.CLOUDANT_REVERSE_PROXY_URL));
app.use(cloudant_proxy('db', gs.CLOUDANT_REVERSE_PROXY_URL));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
