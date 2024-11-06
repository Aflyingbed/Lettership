const firstNameInput = document.getElementById("firstName");
const firstNameError = document.getElementById("firstNameError");

const lastNameInput = document.getElementById("lastName");
const lastNameError = document.getElementById("lastNameError");

const usernameInput = document.getElementById("username");
const usernameError = document.getElementById("usernameError");

const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const signupForm = document.getElementById("signupForm");

const firstNamePattern = /^[A-Za-zÀ-ÿ\s'-]+$/;
const lastNamePattern = /^[A-Za-zÀ-ÿ\s'-]+$/;
const usernamePattern = /^[a-zA-Z0-9_.-]+$/;

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
function validateInput(
	input,
	errorElement,
	errorMessage,
	min,
	max,
	pattern,
	patternMessage,
) {
	const value = input.value.trim();

	if (!value) {
		showError(errorElement, errorMessage);
		return false;
	}

	if (value.length < min || value.length > max) {
		showError(errorElement, `Must be between ${min} and ${max} characters`);
		return false;
	}

	if (pattern && !pattern.test(value)) {
		showError(errorElement, patternMessage);
		return false;
	}

	hideError(errorElement);
	return true;
}

// Show server-side errors if they exist
document.addEventListener("DOMContentLoaded", () => {
	if (firstNameError.textContent.trim()) {
		firstNameError.classList.remove("hidden");
	}
	if (lastNameError.textContent.trim()) {
		lastNameError.classList.remove("hidden");
	}
	if (usernameError.textContent.trim()) {
		usernameError.classList.remove("hidden");
	}
	if (passwordError.textContent.trim()) {
		passwordError.classList.remove("hidden");
	}
	if (confirmPasswordError.textContent.trim()) {
		confirmPasswordError.classList.remove("hidden");
	}
});

// Input validation
firstNameInput.addEventListener("input", () => {
	validateInput(
		firstNameInput,
		firstNameError,
		"First Name is required",
		2,
		30,
		firstNamePattern,
		"Only letters, spaces, hyphens, and apostrophes are allowed",
	);
});

lastNameInput.addEventListener("input", () => {
	validateInput(
		lastNameInput,
		lastNameError,
		"Last Name is required",
		2,
		30,
		lastNamePattern,
		"Only letters, spaces, hyphens, and apostrophes are allowed",
	);
});

usernameInput.addEventListener("input", () => {
	validateInput(
		usernameInput,
		usernameError,
		"Username is required",
		3,
		20,
		usernamePattern,
		"Can only contain letters, numbers, underscores, periods, and hyphens",
	);
});

passwordInput.addEventListener("input", () => {
	validateInput(passwordInput, passwordError, "Password is required", 6, 30);

	if (confirmPasswordInput.value !== "") {
		confirmPasswordInput.dispatchEvent(new Event("input"));
	}
});

confirmPasswordInput.addEventListener("input", () => {
	if (!confirmPasswordInput.value) {
		showError(confirmPasswordError, "Please confirm your password");
	} else if (confirmPasswordInput.value !== passwordInput.value) {
		showError(confirmPasswordError, "Passwords do not match");
	} else {
		hideError(confirmPasswordError);
	}
});

// Form submission
signupForm.addEventListener("submit", (event) => {
	const isFirstNameValid = validateInput(
		firstNameInput,
		firstNameError,
		"First Name is required",
		2,
		30,
		firstNamePattern,
		"Only letters, spaces, hyphens, and apostrophes are allowed",
	);
	const isLastNameValid = validateInput(
		lastNameInput,
		lastNameError,
		"Last Name is required",
		2,
		30,
		lastNamePattern,
		"Only letters, spaces, hyphens, and apostrophes are allowed",
	);
	const isUsernameValid = validateInput(
		usernameInput,
		usernameError,
		"Username is required",
		3,
		20,
		usernamePattern,
		"Can only contain letters, numbers, underscores, periods, and hyphens",
	);
	const isPasswordValid = validateInput(
		passwordInput,
		passwordError,
		"Password is required",
		6,
		30,
	);
	const isConfirmPasswordValid =
		confirmPasswordInput.value === passwordInput.value;

	if (!isConfirmPasswordValid) {
		showError(confirmPasswordError, "Passwords do not match");
	}

	if (
		!isFirstNameValid ||
		!isLastNameValid ||
		!isUsernameValid ||
		!isPasswordValid ||
		!isConfirmPasswordValid
	) {
		event.preventDefault();
	}
});
