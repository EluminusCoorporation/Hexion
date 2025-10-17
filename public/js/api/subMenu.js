var subMenuButton = document.querySelectorAll('.sub-menu-button');

// Event listener sub menus
subMenuButton.forEach((subMenuButtons, i) => {
  subMenuButtons.addEventListener('click', function() {
    const subMenu = this.querySelector('.sub-menu');
    const subMenuToggler = this.querySelector('.toggle-button');
    subMenuToggler.classList.toggle('open')
    subMenu.classList.toggle('open');
  });
});