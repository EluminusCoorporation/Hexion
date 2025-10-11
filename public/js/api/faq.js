// Necessary element import
var faq = document.querySelectorAll(".faq-box-question");

// Makes it usable
faq.forEach((faqs, i) => {
  faqs.addEventListener('click', function() {
    // Activates the faq
    this.classList.toggle("active");
    var ans = this.nextElementSibling;
    ans.classList.toggle("active");
  });
})