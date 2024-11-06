document.addEventListener("DOMContentLoaded", () => {
	const themeControllers = document.querySelectorAll(".theme-controller");
	const defaultTheme = "dark";
	
	const savedTheme = localStorage.getItem("theme") || defaultTheme;
	if (savedTheme) {
		document.documentElement.setAttribute("data-theme", savedTheme);
		const selectedInput = document.querySelector(
			`input[value="${savedTheme}"]`,
		);
		if (selectedInput) {
			selectedInput.checked = true;
		}
	}
	
	themeControllers.forEach((controller) => {
		controller.addEventListener("change", (e) => {
			const selectedTheme = e.target.value;
			document.documentElement.setAttribute("data-theme", selectedTheme);
			localStorage.setItem("theme", selectedTheme);
		});
	});
});
