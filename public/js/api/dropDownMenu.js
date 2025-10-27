//Gets required imports
const dropDownMenu = document.getElementById("dropDownMenu");
const dropDownContent = document.getElementById('dropDownContent');
const dropDownIcon = document.getElementById('ddIcon');
const auto = document.getElementById('auto');
//Gets selected Ext(only for errordebugger)
export var selectedExt = "auto";

//Helper function for changing selectedExt in other files
export function setSelectedExt(ext) {
  selectedExt = ext;
  const extElement = document.getElementById(ext);
  previousSelected = extElement;
}
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
  dropDownContent.classList.toggle("show");
  dropDownIcon.classList.toggle("active");
  
  //Makes a event listener for all Items
  dropDownContent.addEventListener('click', (event) => {
    if (event.target.classList.contains('select-item')) {
      const itemSelect = document.getElementById('dropdown-text');
      const span = document.getElementById('spanR');
      //Sets Selected Ext
      selectedExt = event.target.dataset.ext;
      name = event.target.innerHTML;
      //Removes recommended tag
      if (span) {
        let removeSpanTC = event.target.cloneNode(true);
        removeSpanTC.querySelector('#spanR')?.remove();
        name = removeSpanTC.innerHTML.trim()
      }
      //Ignores if name is Same as the selected one
      if (name === itemSelect.textContent) return;
      //Else starts the process
      else {
        itemSelect.style.color = "var(--text)"
        itemSelect.innerHTML = name;
      }
      //Sets previous selected to Not selected
      if (previousSelected) {
        previousSelected.classList.remove('selected')
      }
      //adds selected
      event.target.classList.add('selected');
      //sets previously selected again
      previousSelected = event.target;
      return;
    }
  });
});