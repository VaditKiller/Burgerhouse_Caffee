document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contact-form');
	const photoInput = document.getElementById('contact-photo');
	const fileName = document.getElementById('file-name');
	const feedback = document.getElementById('report-feedback');

	if (photoInput) {
		photoInput.addEventListener('change', () => {
			const file = photoInput.files[0];
			if (file && file.size > 5 * 1024 * 1024) {
				fileName.textContent = 'The file is larger than 5MB.';
				photoInput.value = '';
				return;
			}
			fileName.textContent = file ? file.name : '';
		});
	}

	if (form) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			feedback.textContent = 'Thanks! Your report has been submitted.';
			form.reset();
			fileName.textContent = '';
		});
	}
});