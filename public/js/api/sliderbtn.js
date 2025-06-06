var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var auto = document.getElementById('auto');
var selectItem = document.getElementsByClassName('select-item');
export var selectedExt = "auto"

auto.classList.add('selected')
dropDownMenu.addEventListener('click', function() {
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  let previousSelected = auto;
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      var itemSelect = document.getElementById('dropdown-text');
      const span = document.getElementById('spanR');
      selectedExt = this.dataset.ext;
      name = this.innerHTML;
      if (span) {
        let removeSpanTC = this.cloneNode(true);
        removeSpanTC.querySelector('#spanR')?.remove();
        name = removeSpanTC.innerHTML.trim()
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