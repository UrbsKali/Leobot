module.exports = {
	name: 'send-mail',
	execute(reciver, subject, html) {
		const { google } = require('googleapis');
		const nodemailer = require('nodemailer');
		const { googleClientSecret, googleClientId, googleToken } = require('../config.json');
		const OAuth2 = google.auth.OAuth2;

		const oauth2Client = new OAuth2(googleClientId, googleClientSecret, 'https://developers.google.com/oauthplayground');
		oauth2Client.setCredentials({ refresh_token: googleToken });

		const accessToken = oauth2Client.getAccessToken();
		const smtpTransport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'devinci.bot@gmail.com',
				clientId: googleClientId,
				clientSecret: googleClientSecret,
				refreshToken: googleToken,
				accessToken: accessToken,
			},
		});
		const mail = {
			from: 'Léobot <devinci.bot@gmail.com>',
			to: reciver,
			subject: subject,
			html: html,
		};
		smtpTransport.sendMail(mail, (error) => {
			if (error) {
				console.log(error);
			}
			smtpTransport.close();
		});
	},
};