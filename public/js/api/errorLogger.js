//Sets an status timeout temp var
let statusTimeout;
//Global setStatus func
export function setStatus(type, title, message) {
  //Clears old timeouts before execution
  clearTimeout(statusTimeout);
  
  //Gets required imports
  const statusContainer = document.getElementById('statusContainer');
  const statusIcon = document.getElementById('statusIcon');
  const statusTitle = document.getElementById('statusTitle');
  const statusMessage = document.getElementById('statusMessage');
  
  //If message is nothing it'll just close the status screen
  if (!message) {
    statusContainer.classList.remove('active');
    statusMessage.textContent = null;
    return;
  }
  
  //Enables the Status screen
  statusContainer.classList.add('active');
  //Adds status message to the status screen
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  
  //Sets the type of status code being used
  if (type === "success") {
    statusContainer.style.backgroundColor = "var(--success)";
    statusIcon.className = "bx bx-check-circle";
  }
  else if (type === "info") {
    statusContainer.style.backgroundColor = "var(--info)"
    statusIcon.className = "bx bx-info-square"
  }
  else if (type === "warn") {
    statusContainer.style.backgroundColor = "var(--warning)";
    statusIcon.className = "bx bx-alert-circle";
  }
  else if (type === "error") {
    statusContainer.style.backgroundColor = "var(--danger)";
    statusIcon.className = "bx bx-alert-triangle";
  };
  
  // Start a new timeout
  statusTimeout = setTimeout(() => {
    statusContainer.classList.remove('active');
    statusMessage.textContent = null;
  }, 7000);
};

//Global error logger func used before the Execution of a FUNC
export function errorLoggerBEFORE(name, text) {
  //Checks if name is not provided
  if (name === "") {
    setStatus('error', 'Process failed', 'Please select a language')
    return false;
  };
  
  //Checks if text is not provided
  if (text === "") {
    setStatus('error', 'Process failed', 'Text cannot be empty!');
    return false;
  };
  //Else clears the timeout and goes forward
  setStatus()
  return true;
};

//Global error logger func used after the execution of a FUNC
export function errorLoggerAFTER(text) {
  //Checks if text has characters that are not valid
  if (text.includes("�")) {
    resultsDiv.style.display = "none";
    setStatus('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  //var used to check if there are invalid characters in a text
  const hasInvalidChars = /[\x00-\x1F]/.test(text);
  //Checks if text has invalid characters(Advance way)
  if (hasInvalidChars) {
    resultsDiv.style.display = "none";
    setStatus('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  //Checks if text is empty
  if (text === "") {
    resultsDiv.style.display = "none";
    setStatus('error', 'Process failed', 'Something went wrong, did you enter a valid text ?');
    return false;
  }
  setStatus()
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
  //Extensions supported
  const supportedExtensions = ["py", "js", "html", "css"]
  //Checks if file exists (2nd way)
  if (file.length === 0) {
    setStatus('error', 'File Upload failed', 'Something went wrong did you select a file?');
    return false;
  };
  //Checks if file size exceeds the file size, limit
  if (file.size > 15728670) {
    setStatus('error', 'File Verification failed', 'File is too large');
    return false;
  }
  setStatus();
  //Else goes forward
  return true;
}