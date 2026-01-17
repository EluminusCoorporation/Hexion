//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../api/errorLogger.js";
import { setFunction } from "../api/dropDownMenu.js";
import {} from "../api/copy.js";

function refreshBody() {
  const requestBodyType = document.querySelector(".body-type");
  const bodyField = document.getElementById("contentBody");

  switch (requestBodyType.textContent) {
    case "application/json":
      bodyField.placeholder = '{ "key": "value" }';
      break;
    case "application/x-www-form-urlencoded":
      bodyField.placeholder = "key=value";
      break;
    case "application/xml":
      bodyField.placeholder = "<data></data>";
      break;
    case "text/plain":
      bodyField.placeholder = "your data here!";
      break;
    default:
      bodyField.placeholder = "body";
      break;
  }
}

setFunction(refreshBody);

const resultsBtn = document.getElementById("results-btn");

document.querySelectorAll(".toggle").forEach(el => {
  el.addEventListener("change", () => {
    const elementToEnable = document.getElementById(el.dataset.el);

    if (!elementToEnable) {
      console.error("Element to enable does not exists");
    }

    elementToEnable.style.display = el.checked ? "flex" : "none";
  });
});

// Makes an event listener for results button
resultsBtn.addEventListener("click", async () => {
  try {
    // toggle the loader on
    toggleLoader(true);
    
    let body;
    const url = document.getElementById("ttc").value;

    const type = document.querySelector(".type").dataset.selected?.toUpperCase();
    const content = document
      .querySelector(".content")
      .dataset.selected?.toLowerCase();
    const accept = document.querySelector(".accept").dataset.selected?.toLowerCase();
    const bodyValue = document.getElementById("contentBody").value;

    const auth = document.querySelector(".authToggler");
    const authField = document.getElementById("auth");
    
    // check if all values are present
    if (type === "GET") {
      if (!url) {
        throw new Error("You've not filled in all the fields.");
      }
    } else {
      if (!url || !content) {
        throw new Error("You've not filled in all the fields.");
      }
    }
    
    // check if its trying to ping internal api
    /* if (!url.startsWith('https')) {
    throw new Error("Cannot request internal api.")
    } */
    
    // check if its trying to ping localhosts
    if (url.startsWith("http://localhost")) {
      throw new Error("Cannot request Localhosts.");
    }
    
    // check if the given body is an usable object
    if (bodyValue) {
      body = JSON.parse(bodyValue);
      
      if (typeof body !== "object") {
        throw new Error("The given body is invalid");
      }
    }

    const fetchObject = {
      method: type,
      headers: {
        "Content-Type": content,
        // only send accept if user has provided one
        ...(accept && { Accepts: accept }),
        // only send auth if user has checked it and provided one
        ...(auth.checked && authField && { Authorization: `Bearer ${authField.value}` })
      },
      // only send body if user has provided one
      ...(body && { body: JSON.stringify({ ...body })}),
    };
    
    // remove certain attributes if its an GET request
    if (type === "GET") {
      delete fetchObject.body;
      delete fetchObject.headers;
    }
    
    // Display the sent headers for debugging purposes
    document.getElementById("headerContainer").style.display = "flex";
    document.getElementById("headers").textContent = JSON.stringify(fetchObject);
      
    // make the actual fetch request
    const response = await fetch(url, fetchObject);
    // throw error if request fails
    if (!response.ok) throw new Error(`${response.status}`);
    
    const data = await response.json();
    // throw error if data has error attribute
    if (data.error) throw new Error(data.error);
    
    // set the sent data for display
    const results = document.getElementById("results");
    results.textContent = JSON.stringify(data);
    
    // display the data
    const resultsDiv = document.getElementById("resultsDiv");
    resultsDiv.style.display = "flex";
  } catch (error) {
    // catch every error and display
    setStatus("error", "Request Sender Failed", error);
    console.error("An error occured while requesting api " + error)
  } finally {
    // disable the loader at the end no matter whats the result
    toggleLoader(false);
  }
});
