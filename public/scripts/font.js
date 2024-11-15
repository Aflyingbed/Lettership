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

  const soundEffects = {
    "font-['Special-Elite']": "../sfx/font/im-spongebob.mp3",
    "font-['Papyrus']": "../sfx/font/freaky-ahh.mp3",
    "font-['Macondo']": "../sfx/font/keep-your-secrets.mp3",
    "font-['Tiny5']": "../sfx/font/evidence-jingle-2013.mp3",
    "font-['Insta']": "../sfx/font/up-meow.mp3",
    "font-['Edo']": "../sfx/font/kiryu-chan.mp3",
    "font-['DS']": "../sfx/font/dark-souls-great-grey-wolf-sif.mp3",
    "font-['Comic']": "../sfx/font/pizza-time.mp3",
  };

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

      const sfxPath = soundEffects[newFont];
      if (sfxPath) {
        currentAudio = new Audio(sfxPath);
        currentAudio.play();
      }
    });
  });
});
