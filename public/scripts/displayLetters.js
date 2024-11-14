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

  if (openEmbed && openEmbed !== embed) {
    openEmbed.classList.add("hidden");
    openEmbed = null;
  }

  if (embed.classList.contains("hidden")) {
    embed.classList.remove("hidden");
    openEmbed = embed;

    if (!embed.dataset.loaded) {
      spinner.style.display = "flex";
      const iframe = document.getElementById(`spotifyIframe${id}`);
      iframe.onload = () => {
        spinner.style.display = "none";
        embed.dataset.loaded = "true";
      };
    }
  } else {
    embed.classList.add("hidden");
    openEmbed = null;
  }
}

document.addEventListener("click", (event) => {
  if (
    openEmbed &&
    !openEmbed.contains(event.target) &&
    !event.target.closest(".avatar")
  ) {
    openEmbed.classList.add("hidden");
    openEmbed = null;
  }
});
