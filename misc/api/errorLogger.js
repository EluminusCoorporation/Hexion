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