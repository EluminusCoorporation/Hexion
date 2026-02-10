//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../utils/errorLogger.js";
import { setFunction } from "../utils/dropDownMenu.js";
import {} from "../utils/copy.js";

function refreshBody() {
  const requestBodyType = document.querySelector(".body-type");
  const bodyField = document.getElementById("contentBody");

  switch (requestBodyType.dataset.selected) {
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

function checkTypes() {
  const type = document.querySelector('.type').dataset.selected;
  
  if (type === "GET") {
    document.querySelectorAll('.input-selectors').forEach((input) => input.style.display = "none");
    document.getElementById('contentBody').style.display = "none";
  } else {
    document.querySelectorAll('.input-selectors').forEach((input) => input.style.display = "flex");
    document.getElementById('contentBody').style.display = "flex";
  }
}

function checkAuthType() {
  const authType = document.querySelector('.auth-type').dataset.selected;
  const auth = document.getElementById('auth');
  
  if (authType === "Bearer Token") {
    auth.placeholder = "Token";
  } else if (authType === "Basic Auth") {
    auth.placeholder = "username:password";
  } else if (authType === "Custom") {
    auth.placeholder = "Authorization";
  } else {
    auth.placeholder = "";
  };
};

setFunction(refreshBody);
setFunction(checkTypes);
setFunction(checkAuthType);

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
    const timeout = document.querySelector(".timeoutToggler");
    const authType = document.querySelector('.auth-type').dataset.selected;
    const authField = document.getElementById("auth").value;
    
    // check if all values are present
    if (!url) throw new Error("You've not filled in all the fields.");
    if (type !== "GET") {
      if (!content) throw new Error("You've not filled in all the fields.");
    }
    
    // check if the given body is an usable object
    if (bodyValue) {
      body = JSON.parse(bodyValue);
      
      if (typeof body !== "object") throw new Error("The given body is invalid");
    }
    
    let authValue;
    
    if (auth.checked && authField && authType) {
      if (authType === "Bearer Token") authValue = `bearer ${authField}`;
      else if (authType === "Basic Auth") authValue = 'basic ' + btoa(authField);
      else authValue = authField;
    }
    
    const header = {
      method: type.toLowerCase(),
      url: url,
      headers: {
        "Content-Type": content,
        // only send accept if user has provided one
        ...(accept && { "Accepts": accept }),
        // only send auth if user has checked it and provided one
        ...(authValue && { "Authorization": authValue })
      },
      ...(!timeout && { timeout: 60000 }), // 1 minute
      // only send body if user has provided one
      ...(body && { data: { ...body } }),
    };
    
    // remove certain attributes if its an GET request
    if (type === "GET") {
      delete header.data;
      delete header.headers;
    }
    
    // Display the sent headers for debugging purposes
    document.getElementById("headerContainer").style.display = "flex";
    document.getElementById("headers").textContent = JSON.stringify(header, null, 2);
      
    // make the actual fetch request
    const responseInternal = await fetch("/utils/request", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, header })
    })
    
    if (!responseInternal) throw new Error('No response from our internal server, try again later.')
    
    // checks if response is an valid json
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      throw new Error('Unexpected server response.');
      
      const text = res.text();
      console.error('An unexpected response from the server.\n\nRESPONSE: ' + text);
    };
    
    if (!responseInternal.ok) {
      const errorMessage = (await responseInternal.json()).message || "An unknown error occured.";
      throw new Error(errorMessage);
    }
    
    const data = await responseInternal.json();
    
    // throw error if data has error attribute
    if (!data) throw new Error('No response body sent from your url.');
    
    // set the sent data for display
    const results = document.getElementById("results");
    results.textContent = JSON.stringify(data, null, 2);
    
    // display the data
    const resultsDiv = document.getElementById("resultsDiv");
    resultsDiv.style.display = "flex";
  } catch (error) {
    // catch every error and display
    setStatus("error", "Request Sender Failed", error);
    console.error("An error occured while requesting url " + error)
  } finally {
    // disable the loader at the end no matter whats the result
    toggleLoader(false);
  }
});
