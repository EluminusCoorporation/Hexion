// Gets required imports
const dropDownMenu = document.querySelectorAll("#dropDownMenu");

if (!dropDownMenu) return;

let actionRegistry = {};
export function setFunction(func) {
  actionRegistry[func.name] = func;
}

// make an listener for each dropdown
dropDownMenu.forEach(el => {
  el.addEventListener("click", function () {
    const dropDownContent = el.querySelector("#dropDownContent");
    const dropDownIcon = el.querySelector("#dropdownIcon");

    // Enables Stylers
    dropDownContent.classList.toggle("show");
    dropDownIcon.classList.toggle("active");

    // Makes a event listener for all Items
    dropDownContent.addEventListener("click", event => {
      if (event.target.classList.contains("select-item")) {
        const itemSelect = el.querySelector("#dropdownSelected");
        const name = event.target.innerHTML;
        // Ignores if name is Same as the selected one
        if (name === itemSelect.dataset.selected) return;
        // Else starts the process
        else {
          itemSelect.style.color = "var(--text)";
          itemSelect.innerHTML = name;
          itemSelect.dataset.selected = event.target.textContent;
        }
        // Unselects the previously selected item
        const selectedItems = dropDownContent.querySelectorAll(".selected");
        selectedItems.forEach(item => item.classList.remove("selected"));

        // adds selected
        event.target.classList.add("selected");

        const actionName = el.dataset.action;
        const action = actionRegistry[actionName];

        // silent runner
        if (typeof action === "function") action();
      }
    });
  });
});
