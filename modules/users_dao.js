var dbcon = require('./dbconn');

module.exports = {
	findByEmail: function(email, successf, errorf) {
		console.log('user dao: search for user by email %s', email);

		dbcon.getUserDb().search('user', 'searchEmail', {q:email, include_docs:'true'}, function(error, result) {
			if (error) {
				console.log('user dao: found error %s', error);
				errorf(error);
			} else {
				console.log('user dao: found %d record(s) for %s', result.rows.length, email);
				if (result.rows.length > 0) {
					successf(result.rows[0].doc);
				} else {
					successf(null);
				}
			}
		});
	},
	findByFacebookId: function(fbId, successf, errorf) {
		console.log('user dao: search for user by facebook id %s', fbId);

		dbcon.getUserDb().search('user', 'searchFBID', {q:fbId, include_docs:'true'}, function(error, result) {
			if (error) {
				console.log('user dao: found error %s', error);
				errorf(error);
			} else {
				console.log('user dao: found %d record(s) for %s', result.rows.length, email);
				if (result.rows.length > 0) {
					successf(result.rows[0].doc);
				} else {
					successf(null);
				}
			}
		});
	},
	updateUser: function(user, successf, errorf) {
		console.log("user dao: updating user %s", user.email);

		dbcon.getUserDb().insert(user, user._id, function(error, body) {
			if (error) {
				console.log('user dao: found error %s', error);
				errorf(error);
			} else {
				successf(body);
			}
		});
	},
	insertUser: function(user, successf, errorf) {
		console.log("user dao: inserting user %s", user.email);

		dbcon.getUserDb().insert(user, user._id, function(error, body) {
			if (error) {
				console.log('user dao: found error %s', error);
				errorf(error);
			} else {
				successf(body);
			}
		});
	}
};
