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
  
  //If message is nothing it'll just close the status screen
  if (!message) {
    alertContainer.classList.remove('active');
    alertMessage.textContent = null;
    return;
  }
  
  //Enables the Status screen
  alertContainer.classList.add('active');
  //Adds status message to the status screen
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  
  //Sets the type of status code being used
  if (type === "success") {
    alertContainer.style.backgroundColor = "var(--success)";
    alertIcon.className = "bx bx-check-circle";
  }
  else if (type === "info") {
    alertContainer.style.backgroundColor = "var(--info)"
    alertIcon.className = "bx bx-info-square"
  }
  else if (type === "warn") {
    alertContainer.style.backgroundColor = "var(--warning)";
    alertIcon.className = "bx bx-alert-circle";
  }
  else if (type === "error") {
    alertContainer.style.backgroundColor = "var(--danger)";
    alertIcon.className = "bx bx-alert-triangle";
  };
  
  // Start a new timeout
  alertTimeout = setTimeout(() => {
    alertContainer.classList.remove('active');
    alertMessage.textContent = null;
  }, 7000);
};

// Global error logger func used before the Execution of a FUNC
export function errorLoggerBEFORE(name, text) {
  //Checks if name is not provided
  if (name === "") {
    setAlert('error', 'Process failed', 'Please fill in all the fields.')
    return false;
  };
  
  //Checks if text is not provided
  if (text === "") {
    setAlert('error', 'Process failed', '. fieldsm');
    return false;
  };
  //Else clears the timeout and goes forward
  setAlert()
  return true;
};

//Global error logger func used after the execution of a FUNC
export function errorLoggerAFTER(text) {
  //Checks if text has characters that are not valid
  if (text.includes("�")) {
    resultsDiv.style.display = "none";
    setAlert('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  //var used to check if there are invalid characters in a text
  const hasInvalidChars = /[\x00-\x1F]/.test(text);
  //Checks if text has invalid characters(Advance way)
  if (hasInvalidChars) {
    resultsDiv.style.display = "none";
    setAlert('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  //Checks if text is empty
  if (text === "") {
    resultsDiv.style.display = "none";
    setAlert('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  setAlert()
  //Else goes forward
  return true;
};

//Global file logger func
export function fileLogger(file) {
  //Checks if file exists
  if (!file) return false;
  //File name
  const fileName = file.name;
  //File size
  const fileSize = file.size;
  //File extension
  const fileExtension = fileName.split('.').pop().toLowerCase();
  //Checks if file exists (2nd way)
  if (file.length === 0) {
    setAlert('error', 'File Upload failed', 'Something went wrong did you select a file?');
    return false;
  };
  //Checks if file size exceeds the file size, limit
  if (file.size > 15728670) {
    setAlert('error', 'File Verification failed', 'File is too large');
    return false;
  }
  setAlert();
  //Else goes forward
  return true;
}