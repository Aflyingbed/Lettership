document.querySelectorAll(".edit-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const rowID = button.getAttribute("data-row-id");
    const editForm = document.getElementById(`editForm${rowID}`);
    editForm.style.display =
      editForm.style.display === "none" || editForm.style.display === ""
        ? "block"
        : "none";
  });
});

let openEmbed = null;

function toggleSpotifyEmbed(id) {
  const embed = document.getElementById(`spotifyEmbed${id}`);
  const spinner = document.getElementById(`spinner${id}`);
  const iframe = document.getElementById(`spotifyIframe${id}`);

  if (openEmbed && openEmbed !== embed) {
    pauseSpotifyPlayback(openEmbed.querySelector("iframe"));
    openEmbed.classList.add("hidden");
    openEmbed = null;
  }

  if (embed.classList.contains("hidden")) {
    embed.classList.remove("hidden");
    openEmbed = embed;

    if (!embed.dataset.loaded) {
      spinner.style.display = "flex";
      iframe.onload = () => {
        spinner.style.display = "none";
        embed.dataset.loaded = "true";
      };
    }
  } else {
    pauseSpotifyPlayback(iframe);
    embed.classList.add("hidden");
    openEmbed = null;
  }
}

function pauseSpotifyPlayback(iframe) {
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage({ command: "pause" }, "*");
  }
}

document.addEventListener("click", (event) => {
  if (
    openEmbed &&
    !openEmbed.contains(event.target) &&
    !event.target.closest(".avatar")
  ) {
    pauseSpotifyPlayback(openEmbed.querySelector("iframe"));
    openEmbed.classList.add("hidden");
    openEmbed = null;
  }
});
