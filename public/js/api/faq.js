// Necessary element import
const faq = document.querySelectorAll(".faq-box-question");

// Makes it usable
faq.forEach((faqs, i) => {
  faqs.addEventListener('click', function() {
    // Activates the faq
    this.classList.toggle("active");
    const ans = this.nextElementSibling;
    ans.classList.toggle("active");
  });
})