// Imports the required functions
import { setAlert } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import {} from "../handlers/copy.js";

const resultsBtn = document.getElementById("results-btn");
// Makes an event listener for results button
resultsBtn.addEventListener("click", async function () {
  try {
    const color = document.getElementById('inputContainer').value;
    const format = document.getElementById('dropdownSelected').dataset.selected.toLowerCase();
    
    if (!color || !format) throw new Error('The required field are not filled');
    
    const response = await fetch("/api/color", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color, format })
    });
    
    // check if response is ok
    if (!response.ok) {
      const errorMessage = ((await response.json()).message) || "An unknown error occured.";
      throw new Error(errorMessage);
    };
    
    // Get data
    const data = await response.json();
    console.dir(data);
    
    // Check if data exists
    if (!data) throw new Error('Something went horribly wrong!');
    
    // Display the output
    document.getElementById('colorNameValue').textContent = data.output;
    document.getElementById('colorShowcaseContainer').style.backgroundColor = data.output;
    document.getElementById('colorShowcaseContainer').style.display = "flex";
  } catch (error) {
    console.error('An error occured while converting color: \n' + error);
    setAlert('error', 'Color Converter Failed', error);
  }
});
