// Imports the required functions
import { setAlert } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import {} from "../handlers/copy.js";

let fallbackColor = null;

document.getElementById('fallbackButton').addEventListener("click", () => {
  if (!fallbackColor) return;
  
  // Close error screen
  document.getElementById('colorErrorScreen').style.display = "none";
  // Display the fallback color
  document.getElementById('colorNameValue').textContent = fallbackColor;
  document.getElementById('colorShowcaseContainer').style.backgroundColor = fallbackColor;
  document.getElementById('colorShowcaseContainer').style.display = "flex";
});

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
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || "An unknown error occured.";
      
      // Enable fallback color
      if (errorMessage === "NOVALIDCOLORFOUND") {
        if (errorResponse.fallback) {
          const colorErrorScreen = document.getElementById('colorErrorScreen');
          colorErrorScreen.querySelector('.error-message').textContent = "No suitable color found in this format.";
          fallbackColor = errorResponse.fallback;
          colorErrorScreen.querySelector('#fallbackButton').style.borderBottom = `.2em solid ${fallbackColor}`;
          // Close color showcase screen
          document.getElementById('colorShowcaseContainer').style.display = "none";
          colorErrorScreen.style.display = "flex";
          
          return;
        }
      }
      
      throw new Error(errorMessage);
    };
    
    document.getElementById('colorErrorScreen').style.display = "none";
    
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
