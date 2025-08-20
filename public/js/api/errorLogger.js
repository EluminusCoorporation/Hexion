import { selectedExt } from './dropDownMenu.js'
//Sets an error timeout var
let errorTimeout;
//Global setError func
export function setError(message) {
  //Clears old timeouts before execution
  clearTimeout(errorTimeout);
  //Gets required imports
  var errorText = document.getElementById('errorText');
  var errorDiv = document.getElementById('errorDiv');
  //Enables the Error screen
  errorDiv.style.display = "flex";
  //Adds error to the error screen
  errorText.textContent = message;
  //If text content is nothing it'll just close the error screen
  if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }
  
  // Start a new timeout
  errorTimeout = setTimeout(() => {
    errorDiv.style.display = 'none';
    errorText.textContent = '';
  }, 7000);
};

//Used for SetError In file menu Func
export function setErrorFile(message) {
  //Clears old timeouts before execution
  clearTimeout(errorTimeout);
  //Gets required imports
  var errorText = document.getElementById('errorTextUPLOAD');
  var errorDiv = document.getElementById('errorDivUPLOAD');
  //Enables error screen
  errorDiv.style.display = "flex";
  //Adds error to the error screen
  errorText.textContent = message;
  //If text content is nothing it'll just close the error screen
  if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }
  
  // Start a new timeout
  errorTimeout = setTimeout(() => {
    errorDiv.style.display = 'none';
    errorText.textContent = '';
  }, 7000);
}

//Global error logger func used before the Execution of a FUNC
export function errorLoggerBEFORE(name, text) {
  //Checks if name is not provided
  if (name === "") {
    setError('Please select a language')
    return false;
  }
  
  //Checks if text is not provided
  if (text === "") {
    setError('Text cannot be empty!');
    return false;
  }
  //Else clears the timeout and goes forward
  setError('')
  return true;
}

//Global error logger func used after the execution of a FUNC
export function errorLoggerAFTER(text) {
  //Checks if text has characters that are not valid
  if (text.includes("�")) {
    resultsDiv.style.display = "none";
    setError('Something went wrong, did you enter a valid text ?');
    return false;
  }
  //var used to check if there are invalid characters in a text
  const hasInvalidChars = /[\x00-\x1F]/.test(text);
  //Checks if text has invalid characters(Advance way)
  if (hasInvalidChars) {
    resultsDiv.style.display = "none";
    setError('Something went wrong, did you enter a valid text ?');
    return false;
  }
  //Checks if text is empty
  if (text === "") {
    resultsDiv.style.display = "none";
    setError('Something went wrong, did you enter a valid text ?');
    return false;
  }
  //Else goes forward
  return true;
};

//Global file logger func
export function fileLogger(files) {
  //Gets the first file
  const file = files[0]
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
  if (files.length === 0) {
    setError('Something went wrong did you select a file?');
    return false;
  };
  //Sets selectedExt as auto
  if (selectedExt === "auto") {
    //Checks if Extension is supported
    if (!supportedExtensions.includes(fileExtension)) {
      setErrorFile('File Extension not supported by our service');
      return false;
    }
    //Else continues
    setErrorFile('')
    return true;
  }
  //Else checks if not supported
  else if (fileExtension !== selectedExt) {
    setErrorFile(`File Extension not supported by the language you have selected (.${selectedExt})`);
    return false;
  }
  //Checks if file size exceeds the file size, limit
  if (file.size > 15728670) {
    setErrorFile('File is too large');
    return false;
  }
  //Else goes forward
  return true;
}