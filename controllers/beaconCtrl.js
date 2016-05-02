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
    console.log(req.body);

    var validBeacons = [];
    for (b in req.body) {
      //if (req.body[b].address == 'C7:28:1E:54:96:B5') { // mac address for android
      if (req.body[b].address == 'D5:4B:17:1D:E5:36') { // mac address for android
        validBeacons.push(req.body[b]);
      } else if (req.body[b].address == 'EC648286-1F7B-20FA-7B75-FC77F77BDDDE') { // uuid for ios
        validBeacons.push(req.body[b]);
      }
    }

    res.status(200).send(validBeacons);
  }
}
