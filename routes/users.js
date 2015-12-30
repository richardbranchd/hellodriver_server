var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var users_dao = require('../modules/users_dao');
var res_gen = require('../modules/response_gen');

/* find user by email */
router.post('/login', function(req, res, next) {
	console.log(req.body.email);
	users_dao.findByEmail(
		req.body.email, 
		function(data) {
			var user = data;
			if (user != null) {
				res.send(res_gen.createSuccess(1, user));
			} else {
				res.send(res_gen.createError(-1, 'Unknown email address: ' + req.body.email));
			}
		},
		function(error) {
			res.send(res_gen.createError(-1, error));
		});
});

module.exports = router;
