// Loads the Loading screen when the user loads the page
function toggleLoader(value) {
  if (value === true) document.getElementById("loader").classList.remove("fade-out");
  if (value === false) document.getElementById("loader").classList.add("fade-out");
}
window.onload = function() {
  //adds the required classList
  toggleLoader(false)
};