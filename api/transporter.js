import nodemailer from 'nodemailer';

import googleapis from 'googleapis';

const { google } = googleapis;

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken().catch((e) => console.log(e));

export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		user: process.env.GMAIL_USER,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
		accessToken,
	},
});
