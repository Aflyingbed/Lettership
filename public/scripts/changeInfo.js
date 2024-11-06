const form = document.getElementById("personalInfoForm");
const fields = ["firstName", "lastName", "password", "profilePicture"];
const namePattern = /^[A-Za-zÀ-ÿ\s'-]+$/;


function showError(element, errorElement, message) {
	element.classList.add("input-error", "border-error");
	errorElement.textContent = message;
	errorElement.classList.remove("hidden");
}

function clearError(element, errorElement) {
	element.classList.remove("input-error", "border-error");
	errorElement.textContent = "";
	errorElement.classList.add("hidden");
}

function validateName(value, minLength = 2, maxLength = 30) {
	if (value && (value.length < minLength || value.length > maxLength)) {
		return `Name must be between ${minLength} and ${maxLength} characters`;
	}
	if (value && !namePattern.test(value)) {
		return "Name can only contain letters, spaces, hyphens, and apostrophes";
	}
	return "";
}

function validatePassword(value) {
	if (value && value.length < 6) {
		return "Password must be at least 6 characters long";
	}
	return "";
}

function validateFile(file) {
	if (file) {
		const validTypes = ["image/jpeg", "image/png", "image/gif"];
		if (!validTypes.includes(file.type)) {
			return "Please upload an image file (JPEG, PNG, or GIF)";
		}
		if (file.size > 10 * 1024 * 1024) {
			
			return "File size exceeds 10 MB limit";
		}
	}
	return "";
}


function checkInput() {
	const updateButton = document.getElementById("updateButton");
	const anyFieldFilled = fields.some((fieldName) => {
		const input = document.getElementById(fieldName);
		return input && input.value.trim() !== "";
	});


	const hasErrors = fields.some((fieldName) => {
		const errorElement = document.getElementById(`${fieldName}Error`);
		return errorElement && !errorElement.classList.contains("hidden");
	});


	updateButton.disabled = !anyFieldFilled || hasErrors;
}


fields.forEach((fieldName) => {
	const input = document.getElementById(fieldName);
	const errorElement = document.getElementById(`${fieldName}Error`);

	if (!input || !errorElement) return;


	input.addEventListener("input", () => {
		let error = "";
		const value = input.value.trim();


		if (value) {
			if (fieldName === "firstName" || fieldName === "lastName") {
				error = validateName(value);
			} else if (fieldName === "password") {
				error = validatePassword(value);
			}
		}

	
		if (error) {
			showError(input, errorElement, error);
		} else {
			clearError(input, errorElement);
		}
		checkInput();
	});
});


const profilePicture = document.getElementById("profilePicture");
const profilePictureError = document.getElementById("profilePictureError");

if (profilePicture && profilePictureError) {
	profilePicture.addEventListener("change", () => {
		const error = validateFile(profilePicture.files[0]);
		if (error) {
			showError(profilePicture, profilePictureError, error);
		} else {
			clearError(profilePicture, profilePictureError);
		}
		checkInput();
	});
}


form.addEventListener("submit", (event) => {
	let hasError = false;

	fields.forEach((fieldName) => {
		const input = document.getElementById(fieldName);
		const errorElement = document.getElementById(`${fieldName}Error`);

		if (!input || !errorElement) return;

		let error = "";
		if (fieldName === "profilePicture") {
			error = validateFile(input.files[0]);
		} else if (input.value.trim()) {
			if (fieldName === "firstName" || fieldName === "lastName") {
				error = validateName(input.value.trim());
			} else if (fieldName === "password") {
				error = validatePassword(input.value.trim());
			}
		}

		if (error) {
			hasError = true;
			showError(input, errorElement, error);
		}
	});

	if (hasError) {
		event.preventDefault();
	}
});

document.addEventListener("DOMContentLoaded", () => {
	fields.forEach((fieldName) => {
		const errorElement = document.getElementById(`${fieldName}Error`);
		const input = document.getElementById(fieldName);

		if (errorElement && !errorElement.classList.contains("hidden") && input) {
			input.classList.add("input-error", "border-error");
		}
	});
	
	checkInput();
});
