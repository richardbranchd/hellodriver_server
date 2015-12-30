var nodemailer = require('nodemailer');
var ejs = require('ejs');
var fs = require('fs');
var gs = require('./global_settings');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'private.solomon@gmail.com',
		pass: 'W2e3r4t5!'
	}
});

module.exports = {
	send: function(to, subject, template, content, successf, errorf) {
		//Get email template path
		var template = process.cwd() + '/views/templates/' + template + '.ejs';
		var content = content;
		var to = to;
		var subject = subject;

		// Use fileSystem module to read template file
		fs.readFile(template, 'utf8', function (err, file) {
			if(err) return errorf (err);
			var html = ejs.render(file, content);

			var mailOptions = {
				"from": gs.APP_NAME + ' <' + gs.NO_REPLY_EMAIL + '>',
				"to": to,
				"cc": 'rich@branchd.co.za',
				"subject": subject,
				"html": html,
				"forceEmbeddedImages": true
			};

			transporter.sendMail(mailOptions, function (err, info) {
				// If a problem occurs, return callback with the error
				if(err) return errorf(err);
				console.log(info);
				successf(info);
			});
		});
	}
};
