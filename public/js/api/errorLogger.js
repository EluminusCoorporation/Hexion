import { selectedExt } from './dropDownMenu.js'
//Sets an error timeout var
let statusTimeout;
//Global setStatus func
export function setStatus(message) {
  //Clears old timeouts before execution
  clearTimeout(statusTimeout);
  
  //Gets required imports
  var statusMessage = document.getElementById('statusMessage');
  var statusContainer = document.getElementById('statusContainer');
  
  //If text content is nothing it'll just close the error screen
  if (statusMessage.textContent === null) {
    statusContainer.style.display = "none"
  }
  
  //Enables the Error screen
  statusContainer.style.display = "flex";
  //Adds error to the error screen
  statusMessage.textContent = message;
  
  // Start a new timeout
  statusTimeout = setTimeout(() => {
    statusContainer.style.display = 'none';
    statusMessage.textContent = null;
  }, 7000);
};

//Global error logger func used before the Execution of a FUNC
export function errorLoggerBEFORE(name, text) {
  //Checks if name is not provided
  if (name === "") {
    setStatus('Please select a language')
    return false;
  }
  
  //Checks if text is not provided
  if (text === "") {
    setStatus('Text cannot be empty!');
    return false;
  }
  //Else clears the timeout and goes forward
  setStatus('')
  return true;
}

//Global error logger func used after the execution of a FUNC
export function errorLoggerAFTER(text) {
  //Checks if text has characters that are not valid
  if (text.includes("�")) {
    resultsDiv.style.display = "none";
    setStatus('Something went wrong, did you enter a valid text ?');
    return false;
  }
  //var used to check if there are invalid characters in a text
  const hasInvalidChars = /[\x00-\x1F]/.test(text);
  //Checks if text has invalid characters(Advance way)
  if (hasInvalidChars) {
    resultsDiv.style.display = "none";
    setStatus('Something went wrong, did you enter a valid text ?');
    return false;
  }
  //Checks if text is empty
  if (text === "") {
    resultsDiv.style.display = "none";
    setStatus('Something went wrong, did you enter a valid text ?');
    return false;
  }
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
    setStatus('Something went wrong did you select a file?');
    return false;
  };
  //Sets selectedExt as auto
  if (selectedExt === "auto") {
    //Checks if Extension is supported
    if (!supportedExtensions.includes(fileExtension)) {
      setStatus('File Extension not supported by our service');
      return false;
    }
    //Else continues
    setStatus('')
    return true;
  }
  //Else checks if not supported
  else if (fileExtension !== selectedExt) {
    setStatus(`File Extension not supported by the language you have selected (.${selectedExt})`);
    return false;
  }
  //Checks if file size exceeds the file size, limit
  if (file.size > 15728670) {
    setStatus('File is too large');
    return false;
  }
  setStatus('');
  //Else goes forward
  return true;
}