const donationBtn = document.getElementById('donation-btn');
const donationMenu = document.getElementById('donation-menu');
const donationMenuDiv = document.getElementById('donation-menu-div');
donationBtn.addEventListener('click', () => {
  donationMenuDiv.classList.add('active');
  donationMenu.classList.add('active');
  document.body.classList.add('no-scroll');
});
const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', () => {
  donationMenuDiv.classList.remove('active');
  donationMenu.classList.remove('active');
  document.body.classList.remove('no-scroll'); 
});