const titleInput = document.getElementById("title");
const titleError = document.getElementById("titleError");
const letterInput = document.getElementById("letter");
const letterError = document.getElementById("letterError");
const letterForm = document.getElementById("letterForm");

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
    if (titleError.textContent.trim()) {
        titleError.classList.remove('hidden');
    }
    if (letterError.textContent.trim()) {
        letterError.classList.remove('hidden');
    }
});

// Input validation
titleInput.addEventListener("input", () => {
    validateInput(titleInput, titleError, "Title");
});

letterInput.addEventListener("input", () => {
    validateInput(letterInput, letterError, "Letter");
});

// Form submission
letterForm.addEventListener("submit", (event) => {
    const isTitleValid = validateInput(titleInput, titleError, "Title");
    const isLetterValid = validateInput(letterInput, letterError, "Letter");

    if (!isTitleValid || !isLetterValid) {
        event.preventDefault();
    }
});
