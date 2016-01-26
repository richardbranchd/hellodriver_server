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
  },
  distance: function(lat1, lon1, lat2, lon2, cb) {
    var R = 6371000; // metres
    var φ1 = toRad(lat1);
    var φ2 = toRad(lat2);
    var Δφ = toRad(lat2-lat1);
    var Δλ = toRad(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
  }
}

function toRad(n) {
    return n * Math.PI / 180;
}
