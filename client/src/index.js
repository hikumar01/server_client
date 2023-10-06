document.addEventListener('DOMContentLoaded', () => {
	const messageElement = document.getElementById('message');
	fetch('http://127.0.0.1:3001/')
		.then(response => response.json())
		.then(data => {
			messageElement.textContent = data.message;
		})
		.catch(error => {
			messageElement.textContent = 'Error:' + error;
		});
});
