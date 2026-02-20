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
});

const getSavedVolume = () => {
  const saved = localStorage.getItem("appVolume");
  return saved !== null ? parseFloat(saved) : 0.5;
};

const setGlobalVolume = (val) => {
  const volume = parseFloat(val);
  Object.values(sounds).forEach((sound) => {
    sound.volume = volume;
  });
  localStorage.setItem("appVolume", volume);
  
  // Dispatch a global event for font.js and theme.js to pick up
  window.dispatchEvent(new CustomEvent('volumeChanged', { detail: { volume } }));
};

setGlobalVolume(getSavedVolume());

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

  // Volume control logic
  const volumeRange = document.getElementById("volumeRange");
  const mobileVolumeIcon = document.getElementById("mobileVolumeIcon");
  const desktopVolumeRange = document.getElementById("desktopVolumeRange");
  const desktopVolumeIcon = document.getElementById("desktopVolumeIcon");

  const desktopMuteCheckbox = document.getElementById("desktopMuteCheckbox");
  const mobileMuteCheckbox = document.getElementById("mobileMuteCheckbox");

  const updateVolumeUI = (val) => {
    const volume = parseFloat(val);
    [volumeRange, desktopVolumeRange].forEach(el => {
      if (el) el.value = volume;
    });
    
    // Update mute checkboxes (swap state)
    const isMuted = volume === 0;
    [desktopMuteCheckbox, mobileMuteCheckbox].forEach(cb => {
      if (cb) cb.checked = !isMuted; // swap-on is volume-on, so checked = !muted
    });
  };

  const handleVolumeChange = (e) => {
    const val = e.target.value;
    setGlobalVolume(val);
    updateVolumeUI(val);
  };

  const toggleMute = () => {
    const currentVolume = getSavedVolume();
    if (currentVolume > 0) {
      localStorage.setItem("lastVolume", currentVolume);
      setGlobalVolume(0);
      updateVolumeUI(0);
    } else {
      const lastVolume = localStorage.getItem("lastVolume") || 0.5;
      setGlobalVolume(lastVolume);
      updateVolumeUI(lastVolume);
    }
  };

  [volumeRange, desktopVolumeRange].forEach(el => {
    if (el) {
      el.addEventListener("input", handleVolumeChange);
    }
  });

  if (desktopMuteCheckbox) {
    desktopMuteCheckbox.addEventListener("click", (e) => {
      toggleMute();
    });
  }

  if (mobileMuteCheckbox) {
    mobileMuteCheckbox.addEventListener("click", (e) => {
      const isSliderClosed = mobileVolumeSlider.classList.contains("scale-0");
      if (isSliderClosed) {
        // Just opening the slider, don't mute
        e.preventDefault();
        mobileVolumeSlider.classList.remove("scale-0", "opacity-0");
        mobileVolumeSlider.classList.add("scale-100", "opacity-100");
      } else {
        // Slider is already open, perform the mute toggle
        toggleMute();
      }
    });
  }

  // Mobile slider visibility logic (Closing part)
  if (mobileVolumeIcon && mobileVolumeSlider) {
    document.addEventListener("click", (e) => {
      if (!mobileVolumeSlider.contains(e.target) && !mobileVolumeIcon.contains(e.target)) {
        mobileVolumeSlider.classList.add("scale-0", "opacity-0");
        mobileVolumeSlider.classList.remove("scale-100", "opacity-100");
      }
    });
  }

  // Initialize UI
  updateVolumeUI(getSavedVolume());
});
