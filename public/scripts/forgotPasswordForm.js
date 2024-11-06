const usernameInput = document.getElementById("username");
const usernameError = document.getElementById("usernameError");

const lastNameInput = document.getElementById("lastName");
const lastNameError = document.getElementById("lastNameError");

const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const forgotPasswordForm = document.querySelector("form");

// Function to show error
function showError(element, message) {
	element.textContent = message;
	element.classList.remove("hidden");
}

// Function to hide error
function hideError(element) {
	element.textContent = "";
	element.classList.add("hidden");
}

// Function to validate input
function validateInput(input, errorElement, fieldName) {
	if (!input.value.trim()) {
		showError(errorElement, `${fieldName} is required`);
		return false;
	}
	hideError(errorElement);
	return true;
}

// Show server-side errors if they exist
document.addEventListener("DOMContentLoaded", () => {
	if (usernameError.textContent.trim()) {
		usernameError.classList.remove("hidden");
	}
	if (lastNameError.textContent.trim()) {
		lastNameError.classList.remove("hidden");
	}
	if (passwordError.textContent.trim()) {
		passwordError.classList.remove("hidden");
	}
	if (confirmPasswordError.textContent.trim()) {
		confirmPasswordError.classList.remove("hidden");
	}
});

// Input validation
usernameInput.addEventListener("input", () => {
	validateInput(usernameInput, usernameError, "Username");
});

lastNameInput.addEventListener("input", () => {
	hideError(lastNameError);
});

passwordInput.addEventListener("input", () => {
	validateInput(passwordInput, passwordError, "Password");
	if (confirmPasswordInput.value !== "") {
		confirmPasswordInput.dispatchEvent(new Event("input"));
	}
});

confirmPasswordInput.addEventListener("input", () => {
	if (confirmPasswordInput.value === "") {
		showError(confirmPasswordError, "Please confirm your password");
	} else if (confirmPasswordInput.value !== passwordInput.value) {
		showError(confirmPasswordError, "Passwords do not match");
	} else {
		hideError(confirmPasswordError);
	}
});

// Form submission
forgotPasswordForm.addEventListener("submit", (event) => {
	const isUsernameValid = validateInput(
		usernameInput,
		usernameError,
		"Username",
	);
	const isPasswordValid = validateInput(
		passwordInput,
		passwordError,
		"Password",
	);
	const isConfirmPasswordValid =
		confirmPasswordInput.value !== "" &&
		confirmPasswordInput.value === passwordInput.value;

	if (!isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
		event.preventDefault();
		if (!isConfirmPasswordValid) {
			showError(confirmPasswordError, "Please confirm your password");
		}
	}
});
