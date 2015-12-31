module.exports = {
	createError: function(msg) {
		var error = {
			message: msg
		};
		return error;
	},
	createDefaultUnknown: function() {
		var error = {
			message: 'Oops! A technical glitch was found and has been reported to our engineers. Apologies for the inconvenience'
		};
		return error;
	}
};
