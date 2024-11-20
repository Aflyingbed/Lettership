document.addEventListener("DOMContentLoaded", () => {
  const themeControllers = document.querySelectorAll(".theme-controller");
  const defaultTheme = "dark";
  const savedTheme = localStorage.getItem("theme") || defaultTheme;

  const themeSounds = {
    halloween: { path: "../sfx/theme/oh-my-gah.mp3", audio: null },
    dark: { path: "../sfx/theme/notification-bell.mp3", audio: null },
    coffee: { path: "../sfx/theme/zelda-cooking-normal.mp3", audio: null },
    synthwave: { path: "../sfx/theme/cyberpunk-2077.mp3", audio: null },
    sunset: {
      path: "../sfx/theme/i-just-wanna-be-part-of-your-symphony.mp3",
      audio: null,
    },
    cupcake: { path: "../sfx/theme/mii-channel.mp3", audio: null },
    pastel: { path: "../sfx/theme/chocobo_wark.mp3", audio: null },
    valentine: { path: "../sfx/theme/fein-x-nokia.mp3", audio: null },
  };

  Object.entries(themeSounds).forEach(([theme, sound]) => {
    sound.audio = new Audio(sound.path);
    sound.audio.load();
  });

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    const selectedInput = document.querySelector(
      `input[value="${savedTheme}"]`
    );
    if (selectedInput) {
      selectedInput.checked = true;
    }
  }

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
      if (themeSounds[selectedTheme]) {
        currentThemeAudio = themeSounds[selectedTheme].audio;
        currentThemeAudio
          .play()
          .catch((err) => console.log("Could not play sound:", err));
      }
    });
  });
});

document.addEventListener("click", (e) => {
  const ripple = document.createElement("div");

  const cursorSize = 50;

  const rect = document.documentElement.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ripple.style.width = ripple.style.height = `${cursorSize}px`;
  ripple.style.left = `${x - cursorSize / 2}px`;
  ripple.style.top = `${y - cursorSize / 2}px`;

  ripple.classList.add("ripple", "bg-primary/30");

  document.body.appendChild(ripple);

  ripple.style.animation = "ripple-animation 0.6s linear";

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
});
