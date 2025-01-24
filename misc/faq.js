var faq = document.getElementsByClassName("faq-box-question");
var i;
for(i = 0; i < faq.length; i++){
  faq[i].addEventListener('click', function(){
    this.classList.toggle("active");
    var body = this.nextElementSibling;
    if(body.style.maxHeight === "500px"){
      body.style.maxHeight = "0px";
    }
    else {
      body.style.maxHeight = "500px"
    }
  });
};