import { afterTransition } from './utils.js';

//Sets an status timeout temp var
let alertTimeout;
//Global setAlert func
export function setAlert(type, title, message) {
  // Clears old timeouts before execution
  clearTimeout(alertTimeout);
  
  // Gets required imports
  const alertContainer = document.getElementById('alertContainer');
  const alertIcon = document.getElementById('alertIcon');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  
  // If message is empty it'll just close the status screen
  if (!message) {
    alertContainer.classList.remove('active');
    alertTitle.textContent = null;
    alertMessage.textContent = null;
    return;
  }
  
  // Set status title & message to the status screen
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  
  // Sets the type of status code being used
  switch (type.toLowerCase()) {
    case "success":
      alertContainer.style.backgroundColor = "var(--success)";
      alertIcon.className = "bx bx-check-circle";
      break;
    case "info":
      alertContainer.style.backgroundColor = "var(--info)";
      alertIcon.className = "bx bx-info-square";
      break;
    case "warn":
      alertContainer.style.backgroundColor = "var(--warning)";
      alertIcon.className = "bx bx-alert-circle";
      break;
    case "error":
      alertContainer.style.backgroundColor = "var(--danger)";
      alertIcon.className = "bx bx-alert-triangle";
      break;
    default:
      alertContainer.style.backgroundColor = "var(--success)";
      alertIcon.className = "bx bx-check-circle";
      break;
  }
  
  // Enables the Status screen
  alertContainer.classList.add('active');
  
  // Start a new timeout
  alertTimeout = setTimeout(() => {
    alertContainer.classList.remove('active');
    afterTransition(alertContainer, () => {
      alertTitle.textContent = null;
      alertMessage.textContent = null;
    })
  }, 7000);
};

// Close button for alert
document.getElementById("closeButton").addEventListener("click", () => {
  const alertContainer = document.getElementById("alertContainer")
  alertContainer.classList.remove("active");

  // Clears the old status after the transition
  afterTransition(alertContainer, () => {
    document.getElementById("alertMessage").textContent = null;
    document.getElementById('alertTitle').textContent = null;
  });
});

// Global error logger function (after)
export function errorLogger(text) {
  //Checks if text has characters that are not valid
  if (text.includes("�")) {
    setAlert('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  // Checks if text has invalid characters(Advance way)
  else if (/[\x00-\x1F]/.test(text)) {
    setAlert('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  // Checks if text is empty
  else if (text === "") {
    setAlert('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }

  setAlert();
  // Else goes forward
  return true;
};

// Global file logger func
export function fileLogger(file) {
  //Checks if file exists
  if (!file) return false;
  // File name
  const fileName = file.name;

  // Checks if file exists (2nd way)
  if (file.length === 0) {
    setAlert('error', 'File Upload failed', 'Something went wrong did you select a file?');
    return false;
  };
  // Checks if file size exceeds the file size, limit
  if (file.size > 15728670) {
    setAlert('error', 'File Verification failed', 'File is too large');
    return false;
  }
  setAlert();
  // Else goes forward
  return true;
}