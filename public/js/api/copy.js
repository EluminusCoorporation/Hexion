document.addEventListener('DOMContentLoaded', function() {
  const togglecopy = document.getElementById('copy-icon');
  
  togglecopy.addEventListener('click', function() {
    // Get the latest value on click 
    const resultsInput = document.getElementById('results').value;
    // Copy text to clipboard with error handling
    navigator.clipboard.writeText(resultsInput).then(() => {
      
      // Toggle the icon
      this.classList.toggle('bx-copy');
      this.classList.toggle('bx-check');
      
      // Store reference to button for setTimeout
      const btn = this;
      setTimeout(() => {
        btn.classList.remove('bx-check');
        btn.classList.add('bx-copy');
      }, 2000);
    }).catch(err => {
      setError("Failed to copy text!"); // Show an alert if copy fails
    });
    var copyAlertContainer = document.getElementById('copyAlertContainer')
    copyAlertContainer.classList.add("active")
    setTimeout(() => {
      copyAlertContainer.classList.remove("active")
    }, 3000);
  });
});