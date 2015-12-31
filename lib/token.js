var jwt = require('jsonwebtoken');
var NodeCache = require('node-cache');

var tokenCache = new NodeCache({stdTTL: 1440*31*60, checkperiod: 60*60});
var tokenSecretKey = 'letsgodriving';

module.exports = {
	getCachedToken: function(user) {
		var cachedToken = tokenCache.get(user._id);
		if (cachedToken == null) {
			console.log("token: token not in cache...");
			return null;
		} else {
			console.log('token: returning cached token...');
			return cachedToken;
		}
	},
	getNewToken: function(user) {
		console.log("token: creating new...");
		// create a token that expires on one month
		var token = jwt.sign(user.email, tokenSecretKey, {expiresInMinutes: 1440 * 31});
		tokenCache.set(user._id, token);
		return token;
	},
	getNewUncachedToken: function(user) {
		console.log("token: creating new uncached...");
		// create a token that expires on one month
		var token = jwt.sign(user.email, tokenSecretKey, {expiresInMinutes: 1440 * 31});
		return token;
	},
	cacheToken: function(user, token) {
		console.log("token: caching token %s ", token);
		tokenCache.set(user._id, token);
	},
	hasTokenInCache: function(token) {
		var keys = tokenCache.keys();
		for (var i = 0; i < keys.length; i++) {
			var tmpToken = tokenCache.get(keys[i]);
			if (tmpToken == token) {
				console.log('token: found token in cache for %s', token);
				return true;
			}
		}
		console.log('token: no token found in cache for %s', token);
		return false;
	}
};
