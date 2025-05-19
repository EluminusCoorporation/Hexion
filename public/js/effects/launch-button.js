// Necessary element imports
btn = document.getElementById("button-launch");
btnText = document.getElementById("button-text");
btnIcon = document.getElementById("button-icon")
btn.addEventListener('click', () => {
  // Toggle classList
  btnText.classList.toggle('active');
  btnIcon.classList.toggle('active');
  // Clear old Timeout
  clearTimeout(reset)
  // Timeout to reset
  reset = setTimeout(() => {
    btnIcon.style.transform = "translateY(-100px)"
}, 500);
});