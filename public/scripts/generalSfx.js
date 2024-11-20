const sounds = {
  global: new Audio("../sfx/clicks/click.wav"),
  success: new Audio("../sfx/clicks/success.wav"),
  hover: new Audio("../sfx/clicks/hover.wav"),
  typeDefault: new Audio("../sfx/typing/default.wav"),
  typeReturn: new Audio("../sfx/typing/enter.wav"),
  typeSpace: new Audio("../sfx/typing/space.wav"),
  typeBackspace: new Audio("../sfx/typing/backspace.wav"),
};

Object.values(sounds).forEach((sound) => {
  sound.load();
  sound.volume = 0.5;
});

const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play().catch((err) => console.log("Could not play sound:", err));
};

document.addEventListener("DOMContentLoaded", () => {
  const isInsideNavbarEnd = (element) => element.closest(".navbar-end");

  document.querySelectorAll("[data-sound]").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const soundType = element.dataset.sound;
      if (sounds[soundType]) playSound(sounds[soundType]);
    });

    if (element.hasAttribute("data-sound-hover")) {
      element.addEventListener("mouseenter", () => {
        const hoverSound = sounds[element.dataset.soundHover] || sounds.hover;
        playSound(hoverSound);
      });
    }
  });

  document.querySelectorAll("a, button, select").forEach((element) => {
    if (!element.hasAttribute("data-sound")) {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        playSound(sounds.success);
      });
    }

    if (!element.hasAttribute("data-sound-hover")) {
      element.addEventListener("mouseenter", () => playSound(sounds.hover));
    }
  });

  document.addEventListener("click", (e) => {
    if (isInsideNavbarEnd(e.target)) return;
    if (!e.target.closest("a, button, [data-sound]")) {
      playSound(sounds.global);
    }
  });

  document
    .querySelectorAll('input[type="text"], input[type="password"], textarea')
    .forEach((element) => {
      let lastKeyTime = 0;
      const minTimeBetweenSounds = 50;

      element.addEventListener("keydown", (e) => {
        const currentTime = Date.now();
        if (currentTime - lastKeyTime < minTimeBetweenSounds) return;
        lastKeyTime = currentTime;

        let sound;
        switch (e.key) {
          case "Enter":
            sound = sounds.typeReturn;
            break;
          case " ":
            sound = sounds.typeSpace;
            break;
          case "Backspace":
            sound = sounds.typeBackspace;
            break;
          default:
            sound = sounds.typeDefault;
        }

        playSound(sound);
      });
    });
});
