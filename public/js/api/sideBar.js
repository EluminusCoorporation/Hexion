var sideBarButton = document.getElementById('sideBarButton');
const sideBar = document.getElementById('sideBar');
const backgroundFilter = document.getElementById('backgroundSideBar');
const links = document.querySelectorAll('.nav-bar .side-bar ul li');

sideBarButton.addEventListener('click', () => {
  backgroundFilter.classList.toggle('open');
  sideBar.classList.toggle('open');
});

backgroundFilter.addEventListener('click', () => {
  sideBar.classList.remove('open');
  backgroundFilter.classList.remove('open');
});

links.forEach((link, i) => {
  link.addEventListener('click', () => {
    sideBar.classList.remove('open');
    backgroundFilter.classList.remove('open');
  });
});