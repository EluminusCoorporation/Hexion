// Import required elements
var sideBarButton = document.getElementById('sideBarButton');
const sideBar = document.getElementById('sideBar');
const backgroundFilter = document.getElementById('backgroundSideBar');
const links = document.querySelectorAll('.nav-bar .side-bar ul li a');

// Makes an event listener for sidebar opening & closing
sideBarButton.addEventListener('click', () => {
  backgroundFilter.classList.toggle('open');
  sideBar.classList.toggle('open');
});

// Event listener for closing on outside click
backgroundFilter.addEventListener('click', () => {
  sideBar.classList.remove('open');
  backgroundFilter.classList.remove('open');
});

// Event listener for closing on redirect
links.forEach((link, i) => {
  link.addEventListener('click', () => {
    sideBar.classList.remove('open');
    backgroundFilter.classList.remove('open');
  });
});