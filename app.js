var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var token = require('./lib/token');
var user = require('./db/users');
var methodOverride = require('method-override');

var app = express();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(methodOverride());

var allowCrossDomain = function(req, res, next) {
  console.log('Request origin %s', req.headers.origin);
  //res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);
// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  console.log('filter: applying filter on %s', req.path);

  if (req.path == '/login' || req.path == '/signup' || req.path == '/verify' ||
    req.path == '/loginFB' || req.path == '/forgot' || req.path.indexOf('/images/') == 0) {
    console.log('Path allowed %s', req.path);
    next();
  } else {
    console.log('Path disallowed %s', req.path);
    var bearerHeader = req.headers["authorization"];

    console.log('headers');
    console.log(req.headers);

    if (bearerHeader) {
      user.findByToken(bearerHeader, function(error, data) {
        if (data) {
          next();
        } else {
          console.log('token search error: %s', error);
          res.status(403).send('no token found');
        }
      });
    } else {
      console.log('filter: no headers supplied...');
      res.status(403).send('no token found');
    }
  }
});

app.use('/', routes);

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
  app.use(function(err, req, res, nexzt) {
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

module.exports = app;
