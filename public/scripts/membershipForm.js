const membershipInput = document.getElementById("membership");
const membershipInputError = document.getElementById("membershipError");
const membershipForm = document.querySelector("form"); // Select the form dynamically

// Utility functions
function showError(element, errorElement, message) {
	element.classList.add("input-error");
	errorElement.textContent = message;
	errorElement.classList.remove("hidden");
}

function clearError(element, errorElement) {
	element.classList.remove("input-error");
	errorElement.textContent = "";
	errorElement.classList.add("hidden");
}

// Input validation on input event
membershipInput.addEventListener("input", () => {
	if (membershipInput.value.trim() === "") {
		showError(membershipInput, membershipInputError, "Maybe ask me?");
	} else {
		clearError(membershipInput, membershipInputError);
	}
});

// Form submission validation
membershipForm.addEventListener("submit", (event) => {
	if (membershipInput.value.trim() === "") {
		event.preventDefault();
		showError(membershipInput, membershipInputError, "Maybe ask me?");
	}
});

// Show server-side error if it exists on page load
document.addEventListener("DOMContentLoaded", () => {
	if (!membershipInputError.classList.contains("hidden") && membershipInput) {
		membershipInput.classList.add("input-error");
	}
});
