var express = require('express');
var router = express.Router();
var users_dao = require('../modules/users_dao');
var res_gen = require('../modules/response_gen');
var token = require('../modules/token');
var send_mail = require('../modules/send_mail');
var gs = require('../modules/global_settings');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* login */
router.post('/login', function(req, res, next) {
	console.log('Login attempt for %s', req.body.email);
	users_dao.findByEmail(
		req.body.email,
		function(data) {
			var user = data;
			if (user != null && user.verified == true) {
				console.log('user pwd %s and req pwd %s', user.password, req.body.password);
				if (user.password == req.body.password) {
					var user_token = token.getCachedToken(user);
					if (user_token == null) {
						user_token = token.getNewToken(user);
						user.session_token = user_token;
						users_dao.updateUser(
							user,
							function(data) {
								//res.send(res_gen.createLoginSuccess(res_gen.SUCCESS, user, user_token));
							},
							function(error) {
								console.log('Login error while updating user info: %s', error);
								//res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, 'Oops! An internal error has occurred and our engineers have been notified.'));
							}
						);
					}

          console.log(user);

					res.send(res_gen.createLoginSuccess(res_gen.SUCCESS, user, user_token));
				} else {
					res.send(res_gen.createError(res_gen.INVALID_PASSWORD, 'Invalid password entered.'));
				}
			} else if (user != null && user.verified == false) {
				res.send(res_gen.createError(res_gen.EMAIL_NOT_VERIFIED, 'Please verify your signup by following the instructions sent to ' + req.body.email));
			} else {
				res.send(res_gen.createError(res_gen.INVALID_EMAIL, 'Unknown email address.'));
			}
		},
		function(error) {
			res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, error));
		}
	);
});

/* sign up */
router.post('/signup', function(req, res, next) {
	users_dao.findByEmail(
		req.body.email,
		function(data) {
			var user = data;
			if (user != null) {
				res.send(res_gen.createError(res_gen.EMAIL_ALREADY_REGISTERED, 'Email address %s is already in use.', req.body.email));
			} else {
				user = {
					"email": req.body.email,
					"password": req.body.password,
					"first_name": req.body.first_name,
					"last_name": req.body.last_name,
					"facebook_account": false,
					"verified": false,
					"session_token": "",
					"settings": {
						"distance_measurement_type":"kilometers",
						"bluetooth": {},
						"sound": false,
						"account_type": "app_only",
						"accuracy": "10"
					}
				};
				var user_token = token.getNewUncachedToken(user);
				user.session_token = user_token;
				users_dao.insertUser(
					user,
					function(data) {
						user._id = data.id;

						token.cacheToken(user, user_token);

						var obj = {
							user: {
								"first_name": user.first_name,
								"email": user.email,
								"session_token": user_token
							},
							app_name: 'HelloDriver!',
							host_name: gs.HOST_NAME,
							hello_email: gs.HELLO_EMAIL
						};

						// send the email
						send_mail.send('ankit.ya@cisinlabs.com'/*new_user.email*/, 'Welcome to ' + obj.app_name, 'verify_email', obj,
							function (data) {
								console.log('send email success %s', data);
							},
							function (error) {
								console.log('send email error %s', error);
							}
						);

						res.send(res_gen.createLoginSuccess(res_gen.SUCCESS, user, user_token));
					},
					function(error) {
						console.log('Login error while creating user info: %s', error);
						res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, 'Oops! An internal error has occurred and our engineers have been notified.'));
					}
				);
			}
		},
		function(error) {
			res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, error));
		}
	);
});

router.put('/loginFB', function(req, res, next) {
	console.log('Facebook login attempt for %s', req.body.email);
	users_dao.findByFacebookId(
		req.body.facebook_id,
		function(data) {
			var user = data;
			if (user != null) {
				var user_token = token.getCachedToken(user);
				if (user_token == null || !user.facebook_account) {
					user_token = token.getNewToken(user);
					user.session_token = user_token;
					user.facebook_account = true;
					user.facebook_id = req.body.facebook_id;
					user.email = req.body.email;
					user.first_name = req.body.first_name;
					user.last_name = req.body.last_name;

					users_dao.updateUser(
						user,
						function(data) {
							//res.send(res_gen.createLoginSuccess(res_gen.SUCCESS, user, user_token));
						},
						function(error) {
							console.log('Login error while updating user info: %s', error);
							//res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, 'Oops! An internal error has occurred and our engineers have been notified.'));
						}
					);
				}
			} else {
				// new user so register
				user = {
					"email": req.body.email,
					"first_name": req.body.first_name,
					"last_name": req.body.last_name,
					"facebook_account": true,
					"facebook_id": req.body.facebook_id,
					"verified": true,
					"session_token": "",
					"settings": {
						"distance_measurement_type":"kilometers",
						"bluetooth": {},
						"sound": false,
						"account_type": "app_only",
						"accuracy": "10"
					}
				};
				var user_token = token.getNewUncachedToken(user);
				user.session_token = user_token;
				users_dao.insertUser(
					user,
					function(data) {
						user._id = data.id;

						token.cacheToken(user, user_token);

						var obj = {
							user: {
								"first_name": user.first_name,
								"email": user.email,
								"session_token": user_token
							},
							app_name: 'HelloDriver!',
							host_name: gs.HOST_NAME,
							hello_email: gs.HELLO_EMAIL
						};

						// send the email
						send_mail.send('ankit.ya@cisinlabs.com'/*new_user.email*/, 'Welcome to ' + obj.app_name, 'signup_facebook', obj,
							function (data) {
								console.log('send email success %s', data);
							},
							function (error) {
								console.log('send email error %s', error);
							}
						);

						res.send(res_gen.createLoginSuccess(res_gen.SUCCESS, user, user_token));
					},
					function(error) {
						console.log('Login error while creating user info: %s', error);
						res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, 'Oops! An internal error has occurred and our engineers have been notified.'));
					}
				);
			}
		},
		function(error) {
			res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, error));
		}
	);
});

/* verify email */
router.get('/verify', function(req, res, next) {
	var query = require('url').parse(req.url,true).query;
	var email = query.email;
	var token = query.token;
	console.log('Verify email attempt for %s for token %s', email, token);

	users_dao.findByEmail(
		email,
		function(data) {
			var user = data;
			if (user != null) {
				if (user.session_token == token) {
					user.verified = true;
					users_dao.updateUser(
						user,
						function(data) {
							//res.send(res_gen.createLoginSuccess(res_gen.SUCCESS, user, user_token));
						},
						function(error) {
							console.log('Login error while updating user info: %s', error);
							//res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, 'Oops! An internal error has occurred and our engineers have been notified.'));
						}
					);
					res.send(res_gen.createSuccess(res_gen.SUCCESS, 'Email verified successfully!'));
				} else {
					res.send(res_gen.createError(res_gen.VERIFY_EMAIL_FAILED, 'Unable to verify email.'));
				}
			} else {
				res.send(res_gen.createError(res_gen.INVALID_EMAIL, 'Unknown email address: ' + req.body.email));
			}
		},
		function(error) {
			res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, error));
		});
});

/* forgot password */
router.post('/forgot', function(req, res, next) {
	users_dao.findByEmail(
		req.body.email,
		function(data) {
			var user = data;
			if (user != null) {
				// todo: send email
				// regardless of whether or not user is verified we send the same one
				// todo: check if user is logged in on FB
        res.send(res_gen.createSuccess(res_gen.SUCCESS, 'Forgot password email sent to ' + req.body.email));
			} else {
				res.send(res_gen.createError(res_gen.INVALID_EMAIL, 'Unknown email address: ' + req.body.email));
			}
		},
		function(error) {
			res.send(res_gen.createError(res_gen.UNKNOWN_ERROR, error));
		});
});

module.exports = router;
