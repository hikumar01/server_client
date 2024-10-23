import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

// const cors = require('cors');

const PORT = process.env.PORT || 8080;
const clientFolder = '../client/dist';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, clientFolder);
const clientIndex = path.join(clientPath, 'index.html');

const app = express();

app.use(express.json());

// app.use(cors());

// FIXME: Find out a way to whitelist only few/one server
// app.use(cors({
// 	origin: ['http://127.0.0.1:8080'],
// }));

app.use(session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: process.env.NODE_ENV === 'production', // Set to true if in production
		httpOnly: true, // Ensures the cookie is accessible only by the web server
		sameSite: 'strict', // Protects against CSRF attacks by not sending the cookie with cross-site requests
		maxAge: 60 * 1000 // 1 minute in milliseconds
	}
}));

app.use((req, res, next) => {
	console.log('Request URL: ', req.originalUrl);
	if (process.env.NODE_ENV === 'development') {
		if (req.session) {
			console.log('Session ID:', req.session.id);
			console.log('Session Data:', req.session);
		}
	}
	next();
});

app.get('/api/count', (req, res) => {
	if (req.session) {
		req.session.views = (req.session.views || 0) + 1;
		const body = {
			views: req.session.views,
			localTimeExpire: new Date(req.session.cookie.expires).toLocaleString()
		};
		// body.session = req.session;
		res.json(body);
	} else {
		res.send('Session not initialized');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send('Logout failed');
		}
		res.clearCookie('connect.sid'); // Clear the session cookie
		res.redirect('/login');
	});
});

app.use(express.static(clientPath));

app.get('*', (req, res) => {
	res.sendFile(clientIndex);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
