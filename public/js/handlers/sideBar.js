// Import required elements
const sideBarButton = document.getElementById("sideBarButton");
const sideBar = document.getElementById("sideBar");
const backgroundFilter = document.getElementById("backgroundSideBar");

const subMenu = document.querySelectorAll(".sub-menu");
const links = document.querySelectorAll(".nav-bar .side-bar ul li a");

// function for sidebar closing
function sideBarClose() {
  //Closes the sideBar
  sideBar.classList.remove("open");
  backgroundFilter.classList.remove("open");

  // Closes the opened sub Menus
  subMenu.forEach(subMenus => {
    const subMenuButton = subMenus.parentNode;
    const subMenuToggler = subMenuButton.querySelector(".toggle-button");
    subMenuToggler.classList.remove("open");
    subMenus.classList.remove("open");
  });
}

// Makes an event listener for sidebar opening & closing
sideBarButton.addEventListener("click", () => {
  backgroundFilter.classList.toggle("open");
  sideBar.classList.toggle("open");

  // Closes the opened sub Menus on sidebar close
  subMenu.forEach(subMenus => {
    const subMenuButton = subMenus.parentNode;
    const subMenuToggler = subMenuButton.querySelector(".toggle-button");
    subMenuToggler.classList.remove("open");
    subMenus.classList.remove("open");
  });
});

// Event listener for closing on outside click
backgroundFilter.addEventListener("click", sideBarClose);

// Event listener for closing on redirect
links.forEach(link => link.addEventListener("click", sideBarClose));
