// Gets required imports
const dropDownMenu = document.querySelectorAll("#dropDownMenu");

let actionRegistry = {};
export function setFunction(func) {
  actionRegistry[func.name] = func;
}

function closeAllOpenedDropdown() {
  document.querySelectorAll("#dropDownContent.show").forEach(dropdown => {
    // Toggle the dropdown
    dropdown.classList.remove("show");
    // Toggle the icon
    dropdown.parentNode.querySelector("#dropdownIcon").classList.remove("active");
  });
}

if (dropDownMenu) {
  // make an listener for each dropdown
  dropDownMenu.forEach(el => {
    const dropDownContent = el.querySelector("#dropDownContent");
    
    el.addEventListener("click", function () {
      if (!dropDownContent.classList.contains("show")) closeAllOpenedDropdown();
      // Toggle the dropdown
      dropDownContent.classList.toggle("show");
      // Toggle the icon
      el.querySelector("#dropdownIcon").classList.toggle("active");
    });
    
    // Makes a event listener for all Items
    dropDownContent.addEventListener("click", event => {
      if (!event.target.classList.contains("dropdown-item")) return;
      let name = event.target.innerHTML;
      
      // If even a single tag is applied, remove it
      let sanitizedItem = event.target;
      const tags = event.target.querySelector('.tag');
      if (tags) {
        // Clone it to avoid removing actual tags
        sanitizedItem = event.target.cloneNode(true);
        // Remove all tags
        sanitizedItem.querySelectorAll('.tag').forEach(tag => tag.remove());
        // Apply the sanitized name
        name = sanitizedItem.innerHTML;
      };
      
      // Ignores if name is Same as the selected one
      const selectorItem = el.querySelector("#dropdownSelected");
      if (event.target.textContent !== selectorItem.dataset.selected) {
        selectorItem.style.color = "var(--text)";
        selectorItem.innerHTML = name;
        selectorItem.dataset.selected = sanitizedItem.textContent;
      };
      
      // Unselects the previously selected item(s)
      dropDownContent.querySelectorAll(".selected").forEach(item => item.classList.remove("selected"));

      // adds selected
      event.target.classList.add("selected");

      const actionName = el.dataset.action;
      const action = actionRegistry[actionName];
      // silent runner
      if (typeof action === "function") action();
    });
  });
  
  // Make an event listener to close dropdowns on outside click
  document.addEventListener("click", event => {
    // Handle dropdown closing in the dropdown event listener
    if (event.target.closest('#dropDownMenu')) return;
    
    closeAllOpenedDropdown();
  })
}