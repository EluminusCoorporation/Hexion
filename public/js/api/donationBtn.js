// Necessary element imports
const donationBtn = document.getElementById('donation-btn');
const donationMenu = document.getElementById('donation-menu');
const donationMenuDiv = document.getElementById('donation-menu-div');
const closeBtn = document.getElementById('close-btn'); 

donationBtn.addEventListener('click', () => {
  // Activates the donation menu
  donationMenuDiv.classList.add('active');
  donationMenu.classList.add('active');
  document.body.classList.add('no-scroll');
});

// Close button used to close the donation menu
closeBtn.addEventListener('click', () => {
  // Deactivates the donation menu
  donationMenuDiv.classList.remove('active');
  donationMenu.classList.remove('active');
  document.body.classList.remove('no-scroll'); 
});