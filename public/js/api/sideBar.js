var sideBarButton = document.getElementById('sideBarButton');
const sideBar = document.getElementById('sideBar');
const backgroundFilter = document.getElementById('backgroundSideBar')

sideBarButton.addEventListener('click', () => {
  backgroundFilter.classList.toggle('open');
  sideBar.classList.toggle('open');
});

backgroundFilter.addEventListener('click', () => {
  sideBar.classList.remove('open');
  backgroundFilter.remove('open');
});