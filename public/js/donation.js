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
});

// Handle donate
const donationRedirectButton = document.getElementById('donationRedirectButton');
donationRedirectButton.addEventListener("click", () => {
  // Get amount
  const amount = document.getElementById('amount').value;
  
  // Redirect to UPI Link
  window.location.href = `upi://pay?pa=your@ybl&pn=Hexion Donation&am=${amount}&cu=INR&tn=Donation To Hexion of ₹${amount}`;
});