/*
var request = require('request')

module.exports = function(pattern, host){
  return function(req, res, next){
  	console.log('Performing cloudant proxy, using host %s...', host);

    if(req.url.match(pattern)){
      console.log('URL %s matches pattern...', req.url);
      var db_path = req.url.match(pattern)[1]
        , db_url = [host, db_path].join('/');
      console.log('Forwarding to cloudant at %s ...', db_url);
      //console.log(req.body);
      if (req.path.indexOf('/db/trip/_revs_diff') == 0) {
        console.log(JSON.stringify({ '60056c60-00b3-4fa8-bf9a-7c6fc16b8beb': [ '1-a9a58236d8cb660c3e86aa7c3dd81458' ] }));
        request({
            url: db_url,
            method: "POST",
            json: true,   // <--Very important!!!
            body: JSON.stringify({ '60056c60-00b3-4fa8-bf9a-7c6fc16b8beb': [ '1-a9a58236d8cb660c3e86aa7c3dd81458' ] })
        }, function (error, response, body){
            console.log(response);
            //console.log(error);
            //console.log(body);
        });
      } else {
        req.pipe(request[req.method.toLowerCase()](db_url)).pipe(res);
      }
    }else{
      console.log('URL %s does not match patter!', req.url);
      next();
    }

    //res.send('ok');
  }
}
*/

var request = require('request');

module.exports = function(prefix, proxy_url){
  return function(req, res, next){
    console.log('Performing cloudant proxy, using %s...', proxy_url);
    var proxy_path = req.path.match(RegExp("^\\/" + prefix + "(.*)$"));
    if(proxy_path){

      var bodyStr = null;
      var isJson = false;
      try {
        bodyStr = JSON.stringify(req.body);
        isJson = true;
      } catch (e) {
        bodyStr = req.body;
      }

      console.log(bodyStr);

      request({
          url: db_url = proxy_url + proxy_path[1],
          method: req.method,
          json: true,
          headers: {
              "content-type": "application/json",
          },
          body: isJson ? JSON.parse(bodyStr) : bodyStr
      }, function (error, response, body) {
        //console.log('error');
        //console.log(error);
        console.log('body');
        console.log(body);
        //console.log('response');
        //console.log(response);
        //next(response);
        if (response && response.statusCode && response.statusMessage) {
          console.log('Got it!!!!');
          //console.log(response);
          res.status(response.statusCode).send(body);
        } else if (body && body.error && body.error == 'not_found') {
          //console.log(response);
          res.status(404).send('Not found');
        } else {
          res.send(body);
        }
      });

      /*

      if (proxy_path.indexOf('/db/trip/_local/5avCb2H.') == 0) {
        console.log('Doing my stuff...');
        request({
            url: db_url = proxy_url + proxy_path[1],
            method: "PUT",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.parse(JSON.stringify(req.body))
        }, function (error, response, body) {
          console.log(body);
          //next(response);
          res.send(body);
        });
      } else if (proxy_path.indexOf('/db/trip/_revs_diff') == 0) {
        request({
            url: db_url = proxy_url + proxy_path[1],
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: { "60056c60-00b3-4fa8-bf9a-7c6fc16b8beb": [ "1-a9a58236d8cb660c3e86aa7c3dd81458" ] }
        }, function (error, response, body) {
          console.log(body);
          //next(response);
          res.send(body);
        });
      } else {

          console.log(req.headers);

          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
          res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        var db_url = proxy_url + proxy_path[1];
        req.pipe(request({
          uri: db_url,
          method: req.method,
          qs: req.query
        })).pipe(res);
      }
      */
    } else {
      next();
    }
    /*
    console.log('Performing cloudant proxy, using host %s...', host);
    var proxy_path = req.path.match(RegExp("^\\/" + prefix + "(.*)$"));
    if(proxy_path){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

      var db_url = proxy_url + proxy_path[1];
      req.pipe(request({
        uri: db_url,
        method: req.method,
        qs: req.query
      })).pipe(res);
    } else {
      next();
    }
    */
  };
};
