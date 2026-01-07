//Imports the required functions
import { setStatus, errorLoggerBEFORE } from "../api/errorLogger.js";
import {} from "../api/dropDownMenu.js";
import {} from "../api/copy.js";

const resultsBtn = document.getElementById("results-btn");

//Makes an event listener for results button
resultsBtn.addEventListener("click", async function () {
  const url = document.getElementById('ttc').value;
  
  const type = document.querySelector('.type').textContent.toUpperCase();
  const content = document.querySelector('.content').textContent.toLowerCase();
  const accept = document.querySelector('.accept').textContent.toLowerCase();
  
  const bodyValue = document.getElementById('contentBody').value;
  const body = {...bodyValue}
  
  switch (type) {
    case 'GET':
      if (!url) {
        setStatus('error', 'Fields Required', "You've not filled in all the fields");
        return;
      }
      break;
    case 'POST':
    case 'PUT':
    case 'DELETE':
      if (!url || !content) {
        setStatus('error', 'Fields Required', "You've not filled in all the fields");
        return;
      }
      break;
  }
  
  const fetchObject = {
    method: type,
    headers: { 'Content-Type': content, ...accept && { 'Accepts': accept }, },
    body: JSON.stringify({ body })
  };
  
  if (type === 'GET') {
    delete fetchObject.body;
    delete fetchObject.headers;
  };
  
  await fetch(url, fetchObject)
  .then(response => {
    if (!response.ok) throw new Error(`${response.status}`)
    response.json();
  })
  .then(data => {
    if (data.error) throw new Error(data.error);
    
    const results = document.getElementById('results');
    results.textContent = JSON.stringify(data);
    const resultsDiv = document.getElementById('resultsDiv');
    resultsDiv.style.display = "flex"
  })
  .catch(error => {
    console.log('Error sending request:', error);
    setStatus('error', 'Request Sender failed', 'An error occured on sending request: ' + error)
  })
  .finally(() => {
  });
});
