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


