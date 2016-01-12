var errGen = require('../lib/errorMsgGen');
var config = require('../config');

module.exports = {
  cost: function(req, res, next) {
    console.log(req.params.locale)
    if (req.params.locale.indexOf('ZA') >= 0) {
      res.status(200).send('R 120.00');
    } else {
      res.status(500).send("we don't sell these devices in your country yet.");
    }
  },
  verify: function(req, res, next) {
    console.log(req.body.beacons);

    var validBeacons = [];
    for (b in req.body.beacons) {
      if (req.body.beacons[b].address == 'C7:28:1E:54:96:B5') {
        validBeacons.push(req.body.beacons[b]);
      }
    }

    res.status(200).send(validBeacons);
  }
}
