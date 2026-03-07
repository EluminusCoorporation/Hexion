//Gets the required elements
const closeButton = document.getElementById("closeButton");
const statusContainer = document.getElementById("statusContainer");
const statusMessage = document.getElementById("statusMessage");

//Closes the status bar
closeButton.addEventListener("click", () => {
  statusContainer.classList.remove("active");
  //Clears the old status
  statusMessage.textContent = null;
});
