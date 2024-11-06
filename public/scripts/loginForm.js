const usernameInput = document.getElementById("username");
const usernameError = document.getElementById("usernameError");
const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
const loginForm = document.getElementById("loginForm");

// Function to show error
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// Function to hide error
function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
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
document.addEventListener('DOMContentLoaded', () => {
    if (usernameError.textContent.trim()) {
        usernameError.classList.remove('hidden');
    }
    if (passwordError.textContent.trim()) {
        passwordError.classList.remove('hidden');
    }
});

// Input validation
usernameInput.addEventListener("input", () => {
    validateInput(usernameInput, usernameError, "Username");
});

passwordInput.addEventListener("input", () => {
    validateInput(passwordInput, passwordError, "Password");
});

// Form submission
loginForm.addEventListener("submit", (event) => {
    const isUsernameValid = validateInput(usernameInput, usernameError, "Username");
    const isPasswordValid = validateInput(passwordInput, passwordError, "Password");

    if (!isUsernameValid || !isPasswordValid) {
        event.preventDefault();
    }
});