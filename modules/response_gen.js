module.exports = {
	createError: function(code, msg) {
		var error = {
			response_type: 'error',
			respose_code: code,
			response_msg: msg
		};
		return error;
	},
	createSuccess: function(code, data) {
		var success = {
			response_type: 'success',
			respose_code: code,
			response_data: data
		};
		return success;
	},
	createLoginSuccess: function(code, data, token) {
		var success = {
			response_type: 'success',
			respose_code: code,
			response_data: data,
			response_token: token
		};
		return success;
	}
};

module.exports.SUCCESS = 1;

module.exports.INVALID_EMAIL = -1;
module.exports.INVALID_PASSWORD = -2;
module.exports.EMAIL_ALREADY_REGISTERED = -3;

module.exports.EMAIL_NOT_VERIFIED = -4;
module.exports.VERIFY_EMAIL_FAILED = -5;

module.exports.UNKNOWN_ERROR = -99;