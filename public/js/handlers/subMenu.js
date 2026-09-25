const subMenuButton = document.querySelectorAll(".sub-menu-toggler");

// Event listener sub menus
subMenuButton.forEach((subMenuButtons) => {
  subMenuButtons.addEventListener("click", function () {
    //Activates the submenu
    const subMenu = this.parentNode.querySelector(".sub-menu");
    this.querySelector(".toggle-button").classList.toggle("open");
    subMenu.classList.toggle("open");
  });
});
