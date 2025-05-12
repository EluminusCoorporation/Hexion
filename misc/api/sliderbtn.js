var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var selectItem = document.getElementsByClassName('select-item');

dropDownMenu.addEventListener('click', function() {
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  let previousSelected = null
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      var itemSelect = document.getElementById('dropdown-text');
      const itemSpecial = document.getElementById('textWrapper');
      const span = document.getElementById('spanR');
      name = this.innerHTML
      if (span) {
        let removeSpanTC = this.cloneNode(true);
        removeSpanTC.querySelector('#spanR')?.remove();
        name = removeSpanTC.textContent.trim()
      }
      if (name === itemSelect.textContent) return;
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
      if (previousSelected) {
        previousSelected.classList.remove('selected')
      }
      this.classList.add('selected')
      previousSelected = this
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