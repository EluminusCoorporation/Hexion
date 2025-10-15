var sideBarButton = document.getElementById('sideBarButton');
const sideBar = document.getElementById('sideBar');

sideBarButton.addEventListener('click', () => {
  sideBar.classList.toggle('open');
});