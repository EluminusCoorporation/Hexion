const closeButton = document.getElementById('closeButton');
const statusContainer = document.getElementById('statusContainer');
const statusMessage = document.getElementById('statusMessage')

closeButton.addEventListener("click", () => {
  statusContainer.classList.remove('active');
  statusMessage.textContent = null;
});