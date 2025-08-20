document.addEventListener('DOMContentLoaded', () => {
  const togglecopy = document.getElementById('copy-icon');
  
  togglecopy.addEventListener('click', function() {
    // Get the latest value on click 
    const resultsInput = document.getElementById('results').value;
    // Copy text to clipboard with error handling
    navigator.clipboard.writeText(resultsInput).then(() => {
      
      // Toggle the icon
      this.classList.toggle('bx-copy');
      this.classList.toggle('bx-check');
      
      // Setting up timeout
      setTimeout(() => {
        this.classList.toggle('bx-check');
        this.classList.toggle('bx-copy');
      }, 2000);
    }).catch(err => {
      setError("Failed to copy text!");
      console.log(err)// log the error if copy fails
    });
    var copyAlertContainer = document.getElementById('copyAlertContainer')
    copyAlertContainer.classList.add("active")
    setTimeout(() => {
      copyAlertContainer.classList.remove("active")
    }, 3000);
  });
});