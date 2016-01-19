var config = require('../config.js');

module.exports = {
  reverseGeoCode: function(lat, lon, cb) {
    var provider = config.geocode.provider;
    var adapter = config.geocode.adapter;
    var extra = {
        apiKey: config.geocode.api_key,
        formatter: null
    };

    var geocoder = require('node-geocoder')(provider, adapter, extra);

    geocoder.reverse({lat:lat, lon:lon}, function(error, data) {
      console.log(data);
      if (data && data.length && data.length > 0) {
        cb(error, data[0]);        
      } else {
        cb(error, data);
      }
    });
  }
}
