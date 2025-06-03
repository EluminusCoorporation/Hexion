var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var selectItem = document.getElementsByClassName('select-item');
export let langExtension;

dropDownMenu.addEventListener('click', function() {
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  let previousSelected = null
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      var itemSelect = document.getElementById('dropdown-text');
      const span = document.getElementById('spanR');
      name = this.innerHTML;
      if (span) {
        let removeSpanTC = this.cloneNode(true);
        removeSpanTC.querySelector('#spanR')?.remove();
        name = removeSpanTC.textContent.trim()
      }
      if (name === itemSelect.textContent) return;
      else {
        itemSelect.style.color = "black"
        itemSelect.innerHTML = name;
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