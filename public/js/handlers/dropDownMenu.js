// Gets required imports
const dropDownMenu = document.querySelectorAll("#dropDownMenu");

let actionRegistry = {};
export function setFunction(func) {
  actionRegistry[func.name] = func;
}

if (dropDownMenu) {
  // make an listener for each dropdown
  dropDownMenu.forEach(el => {
    const dropDownContent = el.querySelector("#dropDownContent");
    
    el.addEventListener("click", function () {
      // Toggle the dropdown
      dropDownContent.classList.toggle("show");
      // Toggle the icon
      el.querySelector("#dropdownIcon").classList.toggle("active");
    });
    
    // Makes a event listener for all Items
    dropDownContent.addEventListener("click", event => {
      if (!event.target.classList.contains("select-item")) return;
      let name = event.target.innerHTML;
      
      // If even a single tag is applied, remove it
      const tags = event.target.querySelector('.tag');
      if (tags) {
        // Clone it to avoid removing actual tags
        const itemClone = event.target.cloneNode(true);
        // Remove all tags
        itemClone.querySelectorAll('.tag').forEach(tag => tag.remove());
        // Apply the sanitized name
        name = itemClone.innerHTML;
      };
      
      // Ignores if name is Same as the selected one
      const selectorItem = el.querySelector("#dropdownSelected");
      if (event.target.textContent !== selectorItem.dataset.selected) {
        selectorItem.style.color = "var(--text)";
        selectorItem.innerHTML = name;
        selectorItem.dataset.selected = event.target.textContent;
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
}