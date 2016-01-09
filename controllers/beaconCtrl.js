var errGen = require('../lib/errorMsgGen');
var config = require('../config');

module.exports = {
  cost: function(req, res, next) {
    console.log(req.params.locale)
    if (req.params.locale.indexOf('_ZA') >= 0) {
      res.status(200).send('R 120.00');
    } else {
      res.status(500).send("we don't sell these devices in your country yet.");
    }
  }
}
