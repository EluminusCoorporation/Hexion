var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var selectItem = document.getElementsByClassName('select-item');

dropDownMenu.addEventListener('click', function() {
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      name = this.innerHTML // Logs each <p> text content
      var itemSelect = document.getElementById('dropdown-text');
      const itemSpecial = document.getElementById('textWrapper')
      if (itemSpecial) {
        // Set the text content to the error message
        itemSelect.style.color = "black"
        itemSelect.innerHTML = name;
        itemSpecial.style.transform = "translate( 0, -14px)"
        return;
      }
      else {
        itemSelect.style.color = "black"
        itemSelect.textContent = name;
      }
      return;
    });
  }
  if (dropDownMenu.style.maxHeight === "500px") {
    dropDownMenu.style.maxHeight = "14px";
  }
  else {
    dropDownMenu.style.maxHeight = "500px"
  }
});