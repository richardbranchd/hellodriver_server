var cloudant = require('cloudant')({'account':'hellodriver', 'password':'Q1w2e3r4!'});
//var cloudant = require('cloudant')({'account':'hellodriver', 'key':'oodysecontstonspecedistr', 'password':'PvLQDoJ2me4q6aCpDHNYiSvx'});

module.exports = {
	getUserDb: function() {
		console.log('dbconn: returning user db connection...');
		var connection = cloudant.use('hellodriver');
		console.log('dbconn: connection valid? ' + (connection != null));
		return connection;
	},
	getSessionDb: function() {
		console.log('dbconn: returning session db connection...');
		var connection = cloudant.user('hellodriver');
		console.log('dbconn: connection valid? ' + (connection != null));
		return connection;
	},
	getTripDb: function() {
		console.log('dbconn: returning trip db connection...');
		var connection = cloudant.user('hellodriver');
		console.log('dbconn: connection valid? ' + (connection != null));
		return connection;
	}
};
