// Necessary element import
var faq = document.getElementsByClassName("faq-box-question");

// i is a placeholder for the clicked faq
var i;
// finds out which faq was clicked and assigned to i
for(i = 0; i < faq.length; i++){
  faq[i].addEventListener('click', function(){
    // Activates the faq
    this.classList.toggle("active");
    var body = this.nextElementSibling;
    if(body.style.maxHeight === "500px"){
      body.style.maxHeight = "0px";
    }
    // Deactivates the faq
    else {
      body.style.maxHeight = "500px"
    }
  });
};