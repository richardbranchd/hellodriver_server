var geocode = require('../lib/geocode.js');
geocode.reverseGeoCode(-25.872958, 28.1459994, function(error, data) {
  console.log('error');
  console.log(error);
  console.log('data');
  console.log(data);
});
