var dbcon = require('../lib/dbconn');

module.exports = {
	findByEmail: function(email, cb) {
		console.log('user dao: search for user by email %s', email);

		dbcon.getUserDb().search('user', 'searchEmail', {q:email, include_docs:'true'}, function(error, result) {
			if (error) {
				console.log('user dao: found error %s', error);
				cb(error, null)
			} else {
				console.log('user dao: found %d record(s) for %s', result.rows.length, email);
				if (result.rows.length > 0) {
					cb(null, result.rows[0].doc);
				} else {
					cb(null, null);
				}
			}
		});
	},
	findByFacebookId: function(fbId, cb) {
		console.log('user dao: search for user by facebook id %s', fbId);

		dbcon.getUserDb().search('user', 'searchFBID', {q:fbId, include_docs:'true'}, function(error, result) {
			if (error) {
				console.log('user dao: found error %s', error);
				cb(error, null);
			} else {
				console.log('user dao: found %d record(s) for %s', result.rows.length, email);
				if (result.rows.length > 0) {
					cb(null, result.rows[0].doc);
				} else {
					cb(null, null);
				}
			}
		});
	},
	updateUser: function(user, cb) {
		console.log("user dao: updating user %s", user.email);

		dbcon.getUserDb().insert(user, user._id, function(error, body) {
			if (error) {
				console.log('user dao: found error %s', error);
				cb(error, null);
			} else {
				cb(null, body);
			}
		});
	},
	insertUser: function(user, cb) {
		console.log("user dao: inserting user %s", user.email);

		dbcon.getUserDb().insert(user, user._id, function(error, body) {
			if (error) {
				console.log('user dao: found error %s', error);
				cb(error, null);
			} else {
				cb(null, body);
			}
		});
	}
};
