var dbcon = require('../lib/dbconn');

module.exports = {
  findById: function(id, cb) {
    dbcon.getTripDb().view('trip', 'byId', {keys:id}, function(error, result) {
      if (error) {
        console.log('trip: found error %s', error);
        cb(error, null);
      } else {
        console.log('trip: found record');
        cb(null, result.rows[0].value);
      }
    });
  },
  udpate: function(trip, cb) {
    dbcon.getTripDb().insert(trip, trip._id, function(error, body) {
      if (error) {
        console.log('trip: found error %s', error);
        cb(error, null);
      } else {
        cb(null, body);
      }
    });
  }
};
