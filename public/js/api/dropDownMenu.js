//Gets required imports
const dropDownMenu = document.querySelectorAll("#dropDownMenu");
const auto = document.getElementById("auto");
//Gets selected Ext(only for errordebugger)
export let selectedExt = "auto";

//Helper function for changing selectedExt in other files
export function setSelectedExt(ext) {
  selectedExt = ext;
  const extElement = document.getElementById(ext);
}

let functionToRun;

export function setFunction(func) {
  functionToRun = func;
}

//Enables auto as default (only for errordebugger)
if (auto) {
  auto.classList.add("selected");
  previousSelected = auto;
}

//event listener for click
dropDownMenu.forEach(el => {
  el.addEventListener("click", function () {
    const dropDownContent = el.querySelector("#dropDownContent");
    const dropDownIcon = el.querySelector("#ddIcon");

    //Enables Stylers
    dropDownContent.classList.toggle("show");
    dropDownIcon.classList.toggle("active");

    //Makes a event listener for all Items
    dropDownContent.addEventListener("click", event => {
      if (event.target.classList.contains("select-item")) {
        const itemSelect = el.querySelector("#dropdown-text");
        const span = el.querySelector("#spanR");
        //Sets Selected Ext
        selectedExt = event.target.dataset.ext;
        let name = event.target.innerHTML;
        //Removes recommended tag
        if (span) {
          let removeSpanTC = event.target.cloneNode(true);
          removeSpanTC.querySelector("#spanR")?.remove();
          name = removeSpanTC.innerHTML.trim();
        }
        //Ignores if name is Same as the selected one
        if (name === itemSelect.textContent) return;
        //Else starts the process
        else {
          itemSelect.style.color = "var(--text)";
          itemSelect.innerHTML = name;
        }
        //Sets previous selected to Not selected
        const selectedItems = dropDownContent.querySelectorAll('.selected');
        selectedItems.forEach(item => item.classList.remove('selected'))
        
        //adds selected
        event.target.classList.add("selected");
        
        if (functionToRun) functionToRun();
        return;
      }
    });
  });
});
