import { setAlert } from './errorLogger.js';

let timeout;
let toastTimeout;

export function copyText(text, el) {
  // Copy text to clipboard
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (!el) return;
      // Toggle the icon
      el.classList.remove("bx-copy");
      el.classList.add("bx-check");

      clearTimeout(timeout);

      // Setting up timeout
      timeout = setTimeout(() => {
        el.classList.remove("bx-check");
        el.classList.add("bx-copy");
      }, 2000);
    })
    .catch(error => {
      setAlert("error", "Copy failed", "Failed to copy text!");
      console.log("An error occured while copying text: " + error);
    });
  
  // Activates the copy toast
  const copyAlertContainer = document.getElementById("copyAlertContainer");
  copyAlertContainer.classList.add("active");
  
  clearTimeout(toastTimeout);
  // Sets a timeout for it
  toastTimeout = setTimeout(() => copyAlertContainer.classList.remove("active"), 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleCopy = document.querySelectorAll("#copy-icon");
  
  if (!toggleCopy) return;

  toggleCopy.forEach(copyToggle => copyToggle.addEventListener("click", function () {
    // Get the latest value of the element
    const value = document.getElementById(this.dataset.el || "results").textContent;
    
    copyText(value, this);
  }));
});
