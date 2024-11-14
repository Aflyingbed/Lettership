document.addEventListener("DOMContentLoaded", () => {
  const fontOptions = document.querySelectorAll("[data-font]");
  const defaultFont = "font-['Insta']";

  const savedFont = localStorage.getItem("fontClass") || defaultFont;

  document.body.className = savedFont;

  fontOptions.forEach((option) => {
    if (option.getAttribute("data-font") === savedFont) {
      option.checked = true;
    }
  });

  fontOptions.forEach((option) => {
    option.addEventListener("change", () => {
      const newFont = option.getAttribute("data-font");
      document.body.className = newFont;
      localStorage.setItem("fontClass", newFont);
    });
  });
});
