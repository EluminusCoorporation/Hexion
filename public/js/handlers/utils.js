export function formatFileSize(bytes) {
  // Gets units
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  //If size is 0 return 0
  if (bytes <= 0) return '0 Bytes';
  
  //Gets the Formatted value
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = Math.max(0, bytes / Math.pow(1024, i));
  
  //Return the formatted value
  return `${value.toFixed(2)} ${units[i]}`;
}

export function afterTransition(el, callback) {
  // Make handler for event listener usage
  const handler = event => {
    // Remove event listener
    el.removeEventListener("transitionend", handler);
    // Run the callback
    callback(event);
  }
  
  el.addEventListener("transitionend", handler);
}