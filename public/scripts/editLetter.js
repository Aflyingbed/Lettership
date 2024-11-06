const editButtons = document.querySelectorAll(".edit-btn");

editButtons.forEach((button) => {
	const rowId = button.getAttribute("data-row-id");
	const editForm = document.getElementById(`editForm${rowId}`);
	const titleInput = editForm.querySelector('input[name="title"]');
	const messageInput = editForm.querySelector('textarea[name="message"]');
	const titleError = document.createElement("span");
	const messageError = document.createElement("span");
	const saveButton = editForm.querySelector('button[type="submit"]');

	titleError.className = "text-error text-sm mt-1 hidden";
	messageError.className = "text-error text-sm mt-1 hidden";
	titleInput.after(titleError);
	messageInput.after(messageError);

	const originalTitle = titleInput.value;
	const originalMessage = messageInput.value;

	const showError = (element, message) => {
		element.textContent = message;
		element.classList.remove("hidden");
	};

	const hideError = (element) => {
		element.textContent = "";
		element.classList.add("hidden");
	};

	const validateInput = (input, errorElement, fieldName) => {
		if (!input.value.trim()) {
			showError(errorElement, `${fieldName} is required`);
			return false;
		}
		hideError(errorElement);
		return true;
	};

	const checkForChanges = () => {
		const titleChanged = titleInput.value !== originalTitle;
		const messageChanged = messageInput.value !== originalMessage;
		const formValid = titleInput.value.trim() && messageInput.value.trim();

		saveButton.disabled = !(titleChanged || messageChanged) || !formValid;
	};

	titleInput.addEventListener("input", () => {
		validateInput(titleInput, titleError, "Title");
		checkForChanges();
	});
	messageInput.addEventListener("input", () => {
		validateInput(messageInput, messageError, "Message");
		checkForChanges();
	});

	button.addEventListener("click", () => {
		editForm.classList.toggle("hidden");

		titleError.classList.add("hidden");
		messageError.classList.add("hidden");
		checkForChanges();
	});

	editForm.addEventListener("submit", (event) => {
		const isTitleValid = validateInput(titleInput, titleError, "Title");
		const isMessageValid = validateInput(messageInput, messageError, "Message");

		if (!isTitleValid || !isMessageValid) {
			event.preventDefault();
		}
	});

	saveButton.disabled = true;
});
