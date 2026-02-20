document.addEventListener("DOMContentLoaded", () => {
  const fontOptions = document.querySelectorAll("[data-font]");
  const defaultFont = "font-['Insta']";
  const savedFont = localStorage.getItem("fontClass") || defaultFont;

  const soundEffects = {
    "font-['Special-Elite']": {
      path: "../sfx/font/im-spongebob.mp3",
      audio: null,
    },
    "font-['Papyrus']": { path: "../sfx/font/freaky-ahh.mp3", audio: null },
    "font-['Macondo']": {
      path: "../sfx/font/keep-your-secrets.mp3",
      audio: null,
    },
    "font-['Tiny5']": {
      path: "../sfx/font/evidence-jingle-2013.mp3",
      audio: null,
    },
    "font-['Insta']": { path: "../sfx/font/up-meow.mp3", audio: null },
    "font-['Edo']": { path: "../sfx/font/kiryu-chan.mp3", audio: null },
    "font-['DS']": {
      path: "../sfx/font/dark-souls-great-grey-wolf-sif.mp3",
      audio: null,
    },
    "font-['Comic']": { path: "../sfx/font/pizza-time.mp3", audio: null },
  };

  Object.entries(soundEffects).forEach(([font, sound]) => {
    sound.audio = new Audio(sound.path);
    sound.audio.load();
  });

  document.body.className = savedFont;
  fontOptions.forEach((option) => {
    if (option.getAttribute("data-font") === savedFont) {
      option.checked = true;
    }
  });

  let currentAudio = null;
  fontOptions.forEach((option) => {
    option.addEventListener("change", () => {
      const newFont = option.getAttribute("data-font");
      document.body.className = newFont;
      localStorage.setItem("fontClass", newFont);

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      if (soundEffects[newFont]) {
        currentAudio = soundEffects[newFont].audio;
        // Apply current volume
        const savedVolume = localStorage.getItem("appVolume");
        if (savedVolume !== null) currentAudio.volume = parseFloat(savedVolume);
        
        currentAudio
          .play()
          .catch((err) => console.log("Could not play sound:", err));
      }
    });
  });

  window.addEventListener('volumeChanged', (e) => {
    const volume = e.detail.volume;
    Object.values(soundEffects).forEach(sound => {
      if (sound.audio) sound.audio.volume = volume;
    });
  });
});
