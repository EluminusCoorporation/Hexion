//Gets required imports
var dropDownMenu = document.getElementById("dropDownMenu");
var dropDownCon = document.getElementById('dropDownCon');
var dropDownIcon = document.getElementById('ddIcon');
var auto = document.getElementById('auto');
var selectItem = document.getElementsByClassName('select-item');
//Gets selected Ext(only for errordebugger)
export var selectedExt = "auto";

//defines the previous selected bar here
let previousSelected;  

//Enables auto as default (only for errordebugger)
if (auto) {
  auto.classList.add('selected');
  previousSelected = auto;
}

//event listener for click
dropDownMenu.addEventListener('click', function() {
  //Enables Stylers
  dropDownContent.classList.toggle("active");
  dropDownIcon.classList.toggle("active");
  
  //Makes a event listener for all Items
  var i;
  for (i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener('click', function() {
      var itemSelect = document.getElementById('dropdown-text');
      const span = document.getElementById('spanR');
      //Sets Selected Ext
      selectedExt = this.dataset.ext;
      name = this.innerHTML;
      //Removes recommended tag
      if (span) {
        let removeSpanTC = this.cloneNode(true);
        removeSpanTC.querySelector('#spanR')?.remove();
        name = removeSpanTC.innerHTML.trim()
      }
      //Ignores if name is Same as the selected one
      if (name === itemSelect.textContent) return;
      //Else starts the process
      else {
        itemSelect.style.color = "black"
        itemSelect.innerHTML = name;
      }
      //Sets previous selected to Not selected
      if (previousSelected) {
        previousSelected.classList.remove('selected')
      }
      //adds selected
      this.classList.add('selected');
      //sets previously selected again
      previousSelected = this;
      return;
    });
  }
  //Closes the drop down menu
  if (dropDownMenu.style.maxHeight === "500px") {
    dropDownMenu.style.maxHeight = "14px";
  }
  //Opens the drop down menu
  else {
    dropDownMenu.style.maxHeight = "500px"
  }
});