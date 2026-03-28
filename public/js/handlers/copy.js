import { setStatus } from './errorLogger.js';

document.addEventListener("DOMContentLoaded", () => {
  const toggleCopy = document.querySelectorAll("#copy-icon");
  
  if (!toggleCopy) return;

  let timeout;
  let toastTimeout;
  toggleCopy.forEach(copyToggle => copyToggle.addEventListener("click", function () {
    // Get the latest value of the element
    const value = document.getElementById(this.dataset.el || "results").textContent;
    // Copy text to clipboard
    navigator.clipboard
      .writeText(value)
      .then(() => {
        // Toggle the icon
        this.classList.remove("bx-copy");
        this.classList.add("bx-check");

        clearTimeout(timeout);

        // Setting up timeout
        timeout = setTimeout(() => {
          this.classList.remove("bx-check");
          this.classList.add("bx-copy");
        }, 2000);
      })
      .catch(error => {
        setStatus("error", "Copy failed", "Failed to copy text!");
        console.log("An error occured while copying text: " + error);
      });
    
    // Activates the copy toast
    const copyAlertContainer = document.getElementById("copyAlertContainer");
    copyAlertContainer.classList.add("active");
    
    clearTimeout(toastTimeout);
    // Sets a timeout for it
    toastTimeout = setTimeout(() => copyAlertContainer.classList.remove("active"), 2000);
  }));
});
