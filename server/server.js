const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

// FIXME: Find out a way to whitelist only few/one server
// app.use(cors({
// 	origin: ['http://127.0.0.1:3000'],
// }));

app.get('/', (req, res) => {
	res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
