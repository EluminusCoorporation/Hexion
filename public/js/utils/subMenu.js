const subMenuButton = document.querySelectorAll('.sub-menu-button');
if (!subMenuButton) return;

// Event listener sub menus
subMenuButton.forEach((subMenuButtons, i) => {
  subMenuButtons.addEventListener('click', function() {
    //Activates the submenu
    const subMenu = this.querySelector('.sub-menu');
    const subMenuToggler = this.querySelector('.toggle-button');
    subMenuToggler.classList.toggle('open')
    subMenu.classList.toggle('open');
  });
});