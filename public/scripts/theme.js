document.addEventListener("DOMContentLoaded", () => {
  const themeControllers = document.querySelectorAll(".theme-controller");
  const defaultTheme = "dark";

  const savedTheme = localStorage.getItem("theme") || defaultTheme;
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    const selectedInput = document.querySelector(
      `input[value="${savedTheme}"]`
    );
    if (selectedInput) {
      selectedInput.checked = true;
    }
  }

  const themeSounds = {
    halloween: "../sfx/theme/oh-my-gah.mp3",
    dark: "../sfx/theme/notification-bell.mp3",
    coffee: "../sfx/theme/zelda-cooking-normal.mp3",
    synthwave: "../sfx/theme/cyberpunk-2077.mp3",
    sunset: "../sfx/theme/i-just-wanna-be-part-of-your-symphony.mp3",
    cupcake: "../sfx/theme/mii-channel.mp3",
    pastel: "../sfx/theme/chocobo_wark.mp3",
    valentine: "../sfx/theme/fein-x-nokia.mp3",
  };

  let currentThemeAudio = null;

  themeControllers.forEach((controller) => {
    controller.addEventListener("change", (e) => {
      const selectedTheme = e.target.value;
      document.documentElement.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("theme", selectedTheme);

      if (currentThemeAudio) {
        currentThemeAudio.pause();
        currentThemeAudio.currentTime = 0;
      }

      const sfxPath = themeSounds[selectedTheme];
      if (sfxPath) {
        currentThemeAudio = new Audio(sfxPath);
        currentThemeAudio.play();
      }
    });
  });
});
