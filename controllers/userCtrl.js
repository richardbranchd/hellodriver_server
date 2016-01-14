var users = require('../db/users');
var token = require('../lib/token');
var sendMail = require('../lib/sendMail');
var errGen = require('../lib/errorMsgGen');
var config = require('../config');

module.exports = {
  login: function(req, res, next) {
  	console.log('Login attempt for %s', req.body.email);
  	users.findByEmail(req.body.email, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
        var user = data;
  			if (user != null && user.verified == true) {
  				console.log('user pwd %s and req pwd %s', user.password, req.body.password);
  				if (user.password == req.body.password) {
  					var user_token = token.getCachedToken(user);
  					if (user_token == null) {
  						user_token = token.getNewToken(user);
  						user.session_token = user_token;
  						users.updateUser(user, function(error, data) {
                // update the user, but no need to wait...
              });
  					}
            res.status(200).json(user);
  				} else {
            res.status(500).json(errGen.createError('Invalid password entered.'));
  				}
  			} else if (user != null && user.verified == false) {
  				res.status(500).json(errGen.createError('Please verify your signup by following the instructions sent to ' + req.body.email));
  			} else {
          res.status(500).json(errGen.createError('Unknown email address.'));
  			}
      }
    });
  },
  signup: function(req, res, next) {
    console.log('signup');
  	users.findByEmail(req.body.email, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
        var user = data;
  			if (user != null) {
          res.status(500).json(errGen.createError('Email address ' + req.body.email + ' is already in use.'));
  			} else {
  				user = {
  					"email": req.body.email,
  					"password": req.body.password,
  					"first_name": req.body.first_name,
  					"last_name": req.body.last_name,
  					"facebook_account": false,
  					"verified": false,
  					"session_token": ""
  				};
  				var user_token = token.getNewUncachedToken(user);
  				user.session_token = user_token;
  				users.insertUser(user, function(error, data) {
            if (error) {
              console.log(error);
              res.status(500).json(errGen.createDefaultUnknown());
            } else {
  						user._id = data.id;
  						token.cacheToken(user, user_token);

  						var obj = {
  							user: {
  								"first_name": user.first_name,
  								"email": user.email,
  								"session_token": user_token
  							},
  							app_name: 'HelloDriver!',
  							host_name: config.host_name,
  							hello_email: config.hello_email
  						};

  						// send the email
  						sendMail.send('rich@branchd.co.za'/*new_user.email*/, 'Welcome to ' + obj.app_name, 'verify_email', obj, function(error, data) {
                if (error) {
                  res.status(500).json(errGen.createDefaultUnknown());
                } else {
                  res.status(200).json(user);
                }
              });
  					}
          });
  			}
      }
    });
  },
  loginFB: function(req, res, next) {
  	console.log('Facebook login attempt for %s', req.body.email);
  	users.findByFacebookId(req.body.facebook_id, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
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

  					users.updateUser(user, function(error, data) {
              if (error) {
                console.log(error);
                res.status(500).json(errGen.createDefaultUnknown());
              } else {
                res.status(200).json(user);
              }
            });
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
  					"session_token": ""
  				};
  				var user_token = token.getNewUncachedToken(user);
  				user.session_token = user_token;
  				users.insertUser(user, function(error, data) {
            if (error) {
              console.log(error);
              res.status(500).json(errGen.createDefaultUnknown());
            } else {
              user._id = data.id;

              token.cacheToken(user, user_token);

              var obj = {
                user: {
                  "first_name": user.first_name,
                  "email": user.email,
                  "session_token": user_token
                },
                app_name: 'HelloDriver!',
                host_name: config.host_name,
                hello_email: config.hello_email
              };

              // send the email
  						sendMail.send('rich@branchd.co.za'/*new_user.email*/, 'Welcome to ' + obj.app_name, 'signup_facebook', obj, function(error, data) {
                if (error) {
                  console.log(error);
                  res.status(500).json(errGen.createDefaultUnknown());
                } else {
                  res.status(200).json(user);
                }
              });
            }
          });
  			}
      }
    });
  },
  verify: function(req, res, next) {
  	var query = require('url').parse(req.url,true).query;
  	var email = query.email;
  	var token = query.token;
  	console.log('Verify email attempt for %s for token %s', email, token);

  	users.findByEmail(email, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
        var user = data;
  			if (user != null) {
  				if (user.session_token == token) {
  					user.verified = true;
  					users.updateUser(user, function(error, data) {
              if (error) {
                console.log(error);
                res.status(500).json(errGen.createDefaultUnknown());
              } else {
                res.status(200).json(user);
              }
            });
  				} else {
  					res.status(500).json(errGen.createError('Unable to verify email.'));
  				}
  			} else {
          res.status(500).json(errGen.createError('Unknown email address: ' + req.body.email));
  			}
      }
    });
  },
  forgot: function(req, res, next) {
  	users.findByEmail(req.body.email, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
        var user = data;
        if (user != null) {
          // todo: send email
          // regardless of whether or not user is verified we send the same one
          // todo: check if user is logged in on FB
          res.status(200).json(user);
        } else {
          res.status(500).json(errGen.createError('Unknown email address: ' + req.body.email));
        }
      }
    });
  },
  update: function(req, res, nex) {
    users.findByEmail(req.body.email, function(error, data) {
      if (error) {
        console.log(error);
        res.status(500).json(errGen.createDefaultUnknown());
      } else {
        var user = data;
        if (user != null) {
          var updatedUser = req.body;
          updatedUser._rev = user._rev;

          users.updateUser(updatedUser, function(error, data) {
            if (error) {
              console.log(error);
              res.status(500).json(errGen.createDefaultUnknown());
            } else {
              res.status(200).json(user);
            }
          });

        }
      }
    });
  }
};
