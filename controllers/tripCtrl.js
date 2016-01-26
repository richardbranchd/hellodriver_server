var trips = require('../db/trip');
var errGen = require('../lib/errorMsgGen');

module.exports = {
  update: function(req, res, next) {
    trips.findById(req.body._id, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
        var newTrip = req.body;
        var oldTrip = data;
        if (trip != null) {
          newTrip._rev = oldTrip._rev; // client generates its own revision numbers
        }

        trips.update(newTrip, function(error, data) {
          if (error) {
            console.log(error);
            res.status(500).json(errGen.createDefaultUnknown());
          } else {
            res.status(200).send('ok');
          }
        });
      }
    });
  }
}
