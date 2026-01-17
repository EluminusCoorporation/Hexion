//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../api/errorLogger.js";
import { setFunction } from "../api/dropDownMenu.js";
import {} from "../api/copy.js";

function refreshBody() {
  const requestBodyType = document.querySelector('.body-type');
  const bodyField = document.getElementById('contentBody');
  
  switch (requestBodyType.textContent) {
    case 'application/json':
      bodyField.placeholder = '{ "key": "value" }'
      break;
    case 'application/x-www-form-urlencoded':
      bodyField.placeholder = 'key=value'
      break;
    case 'application/xml':
      bodyField.placeholder = '<data></data>'
      break;
    case 'text/plain':
      bodyField.placeholder = 'your data here!'
      break;
    default:
      bodyField.placeholder = 'body'
      break;
  }
}

setFunction(refreshBody);

const resultsBtn = document.getElementById("results-btn");

document.querySelectorAll('.toggle').forEach((el) => {
  el.addEventListener("change", () => {
    const elementToEnable = document.getElementById(el.dataset.el);
    
    if (!elementToEnable) {
      console.error('Element to enable does not exists')
    }
    
    elementToEnable.style.display = el.checked ? 'flex' : 'none';
  });
})

//Makes an event listener for results button
resultsBtn.addEventListener("click", function () {
  toggleLoader(true);
  const url = document.getElementById("ttc").value;

  const type = document.querySelector(".type").textContent.toUpperCase();
  const content = document.querySelector(".content").textContent.toLowerCase();
  const accept = document.querySelector(".accept").textContent.toLowerCase();

  const bodyValue = document.getElementById("contentBody").value;
  const body = JSON.parse(bodyValue);
  
  const auth = document.querySelector('.authToggler');
  const authField = document.getElementById('auth');
  
  /* if (!url.startsWith('https')) {
    setStatus('error', 'Request sender failed', 'Cannot request internal api')
    toggleLoader(false);
    return;
  } */
  
  if (url.startsWith('http://localhost')) {
    setStatus('error', 'Request Sender failed', 'Cannot request LocalHosts')
    toggleLoader(false);
    return;
  }
  
  if (type === "GET") {
    if (!url) {
      setStatus(
        "error",
        "Fields Required",
        "You've not filled in all the fields"
      );
      toggleLoader(false);
      return;
    }
  } else {
    if (!url || !content) {
      setStatus(
        "error",
        "Fields Required",
        "You've not filled in all the fields"
      );
      toggleLoader(false);
      return;
    }
  }
  
  if (typeof body !== "object") {
    setStatus('error', 'Request Sender failed', 'The given body is invalid')
    toggleLoader(false);
    return
  }
  
  const fetchObject = {
    method: type,
    headers: { 
      "Content-Type": content, 
      ...(accept && { Accepts: accept }), 
      ...(auth.checked && { Authorization: `Bearer ${authField.value}` })
    },
    body: JSON.stringify({ ...body })
  };

  if (type === "GET") {
    delete fetchObject.body;
    delete fetchObject.headers;
  }
  
  document.getElementById('headerContainer').style.display = "flex";
  document.getElementById('headers').textContent = JSON.stringify(fetchObject);
  
  fetch(url, fetchObject)
    .then(response => {
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.error);

      const results = document.getElementById("results");
      results.textContent = JSON.stringify(data);
      const resultsDiv = document.getElementById("resultsDiv");
      resultsDiv.style.display = "flex";
    })
    .catch(error => {
      console.log("Error sending request:", error);
      setStatus(
        "error",
        "Request Sender failed",
        "An error occured on sending request: " + error
      );
    })
    .finally(() => {
      toggleLoader(false);
    });
});
