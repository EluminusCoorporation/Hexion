// Gets the required elements
const closeButton = document.getElementById("closeButton");
const alertContainer = document.getElementById("alertContainer");
const alertMessage = document.getElementById("alertMessage");

// Closes the status bar
closeButton.addEventListener("click", () => {
  alertContainer.classList.remove("active");
  // Clears the old status
  alertMessage.textContent = null;
});
