document.addEventListener("DOMContentLoaded", () => {
  const toggleCopy = document.getElementById("copy-icon");

  let timeout;

  toggleCopy.addEventListener("click", function () {
    // Get the latest value on click
    const resultsInput = document.getElementById("results").value;
    // Copy text to clipboard with error handling
    navigator.clipboard
      .writeText(resultsInput)
      .then(() => {
        // Toggle the icon
        this.classList.remove("bx-copy");
        this.classList.add("bx-check");

        clearTimeout(timeout);

        // Setting up timeout
        timeout = setTimeout(() => {
          this.classList.remove("bx-check");
          this.classList.add("bx-copy");
        }, 3000);
      })
      .catch(err => {
        setStatus("error", "Copy failed", "Failed to copy text!");
        console.log(err); // log the error if copy fails
      });
    //Activates the copy info alert
    const copyAlertContainer = document.getElementById("copyAlertContainer");
    copyAlertContainer.classList.add("active");
    //Sets a timeout for it
    setTimeout(() => {
      copyAlertContainer.classList.remove("active");
    }, 3000);
  });
});
