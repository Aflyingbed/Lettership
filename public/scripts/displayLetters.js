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

function toggleSpotifyEmbed(id) {
  const embed = document.getElementById(`spotifyEmbed${id}`);
  const spinner = document.getElementById(`spinner${id}`);
  
  if (embed.classList.contains('hidden')) {
    // Just show the embed
    embed.classList.remove('hidden');
    
    // Only show spinner and set up load handler if this is first load
    if (!embed.dataset.loaded) {
      spinner.style.display = 'flex';
      const iframe = document.getElementById(`spotifyIframe${id}`);
      iframe.onload = function() {
        spinner.style.display = 'none';
        embed.dataset.loaded = 'true';
      };
    }
  } else {
    embed.classList.add('hidden');
  }
}