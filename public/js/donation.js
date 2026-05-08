// Necessary element imports
const donationBtn = document.getElementById("donationBtn");
const donationMenuContainer = document.getElementById("donationMenuContainer");
const donationMenu = document.getElementById("donationMenu");
const closeBtn = document.getElementById("paymentCloseBtn");

donationBtn.addEventListener("click", () => {
  // Activates the donation menu
  donationMenuContainer.classList.add("active");
  donationMenu.classList.add("active");
});

// Close button used to close the donation menu
closeBtn.addEventListener("click", () => {
  // Deactivates the donation menu
  donationMenuContainer.classList.remove("active");
  donationMenu.classList.remove("active");
});

// Makes an event listener for each tab switcher
const tabSwitchers = document.querySelectorAll('.tab-container');
tabSwitchers.forEach((switcher, index) => {
  switcher.addEventListener("click", function() {
    // Ignore if already selected
    if (this.classList.contains('selected')) return;
    
    // Add and remove classes
    tabSwitchers.forEach(el => el.classList.remove('selected'));
    this.classList.add('selected');
    
    // Get the tab section details
    const sectionId = this.dataset.section;
    const section = document.getElementById(sectionId);
    
    // Disable all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(el => el.classList.remove('visible'));
    
    // Ignore if doesnt exist
    if (!section) return;
    
    // Enable our section
    section.classList.add('visible');
  });
})