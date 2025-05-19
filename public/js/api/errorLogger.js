import { langExtension } from './sliderbtn.js'

let errorTimeout;
export function setError(message) {
  clearTimeout(errorTimeout);
  var errorText = document.getElementById('errorText');
  var errorDiv = document.getElementById('errorDiv');
  errorDiv.style.display = "flex";
  errorText.textContent = message;
  if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }
  
  // Start a new timeout
  errorTimeout = setTimeout(() => {
    errorDiv.style.display = 'none';
    errorText.textContent = '';
  }, 7000);
};

export function setErrorFile(message) {
  clearTimeout(errorTimeout);
  var errorText = document.getElementById('errorTextUPLOAD');
  var errorDiv = document.getElementById('errorDivUPLOAD');
  errorDiv.style.display = "flex";
  errorText.textContent = message;
  if (errorText.textContent === "") {
    errorDiv.style.display = "none"
  }
  
  // Start a new timeout
  errorTimeout = setTimeout(() => {
    errorDiv.style.display = 'none';
    errorText.textContent = '';
  }, 7000);
} 

export function errorLoggerBEFORE(name, text) {
  if (name === "") {
    setError('Please select a language')
    return false;
  }
  if (text === "") {
    setError('Text cannot be empty!');
    return false;
  }
  setError('')
  return true;
}

export function errorLoggerAFTER(text) {
  if (text.includes("�")) {
    resultsDiv.style.display = "none";
    setError('Something went wrong, did you enter a valid text ?');
    return false;
  }
  const hasInvalidChars = /[\x00-\x1F]/.test(text);
  if (hasInvalidChars) {
    resultsDiv.style.display = "none";
    setError('Something went wrong, did you enter a valid text ?');
    return false;
  }
  if (text === "") {
    resultsDiv.style.display = "none";
    setError('Something went wrong, did you enter a valid text ?');
    return false;
  }
  return true;
};

export function fileLogger(files) {
  const file = files[0]
  if (!file) return false;
  const fileName = file.name;
  const fileSize = file.size;
  const fileExtension = fileName.split('.').pop().toLowerCase();
  if (files.length === 0) {
    setError('Something went wrong did you select a file?')
    return false;
  };
  if (fileExtension !== langExtension) {
    setErrorFile(`File Extension not supported by the language you have selected (.${langExtension})`);
    return false;
  }
  if (file.size > 15728670) {
    setErrorFile('File is too large');
    return false;
  }
  return true;
}