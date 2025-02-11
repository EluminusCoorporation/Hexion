btn = document.getElementById("button-launch");
btnText = document.getElementById("button-text");
btnIcon = document.getElementById("button-icon")
btn.addEventListener('click', () => {
  btnText.classList.toggle('active');
  btnIcon.classList.toggle('active');
  setTimeout(() => {
    btnIcon.style.transform = "translateY(-100px)"
}, 500);
});