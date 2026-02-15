//Import required functions
import { setStatus, errorLoggerBEFORE, fileLogger } from '../utils/errorLogger.js';
import {} from '../utils/copy.js'
import { formatFileSize } from '../utils/fileSizeFormat.js'
import { setFunction } from '../utils/dropDownMenu.js'

let selectedExt = "auto";

function selectExtension() {
  const type = document.getElementById('dropdownSelected').dataset.selected.toLowerCase().trim();
  
  switch (type) {
    case 'auto':
    case 'html':
    case 'css':
      selectedExt = type;
    case 'java script':
      selectedExt = 'js';
    case 'python':
      selectedExt = 'py';
    default:
      selectedExt = type;
  };
}

setFunction(selectExtension);

//import required elements
const resultsBtn = document.getElementById('results-btn');

const fileMode = document.getElementById('fileMode');
const textMode = document.getElementById('textMode');

const buttons = document.querySelectorAll('.dualbtn');
const uploadbtn = document.getElementById('uploadZone');
const textInput = document.getElementById('textmodetxt');

const btnindicator = document.getElementById('btnIndicator')
const uploadWrapper = document.getElementById('uploadWrapper')

//When file mode deactivates remove data
fileMode.addEventListener("click", function() {
  //if current selected ignore
  if (this.classList.contains('selected')) return;
  
  auto.classList.remove('disable');
  textInput.value = null;
  sessionStorage.removeItem("code");
});

//When text mode deactivates remove data
textMode.addEventListener("click", function() {
  //if current selected ignore
  if (this.classList.contains('selected')) return;
  
  const auto = document.getElementById('auto');
  const html = document.getElementById('html');
  
  //disable auto as an option
  if (selectedExt === "auto") {
    selectedExt = "html";
    
    auto.classList.remove('selected');
    html.classList.add('selected');
    
    const htmlName = html.innerHTML;
    const dropdownText = document.getElementById('dropdownSelected');
    
    dropdownText.dataset.selected = "HTML";
    dropdownText.innerHTML = htmlName;
    
    //sends an alert
    setStatus("info", "General Information", "Using html does not automatically debug the style & script elements inside the html, you need to redebug them in their respective types.");
  };
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  
  //deselect auto
  auto.classList.add('disable');
  
  //removes the data
  sessionStorage.removeItem('errorDebuggerFile');
  
  fileNameLabel.textContent = 'Upload File';
  fileIcon.classList.remove('bx', 'bx-file-code');
  fileIcon.classList.add('fa-solid', 'fa-upload');
  
  sessionStorage.removeItem("code");
});

//Makes an event listener for the switchers
buttons.forEach((btn, index) => {
  //Makes filemode as the default
  fileMode.classList.add('selected');
  //On click of any switcher
  btn.addEventListener('click', function() {
    //If it is already selected return
    if (this.classList.contains('selected')) return;
    
    //change the switcher
    btnindicator.style.left = index === 0 ? '0%' : '50%';
    //Deselect the other
    buttons.forEach(b => b.classList.remove('selected'));
    //Activates their menus
    //If its the first button
    if (index === 0) {
      textInput.classList.remove('selected');
      uploadWrapper.classList.add('selected');
    }
    //if its the second button
    else {
      uploadWrapper.classList.remove('selected');
      textInput.classList.add('selected');
    }
    //Adds the activates the clicked
    this.classList.add('selected');
  });
});

//special errorhandler for File Mode
uploadbtn.addEventListener('click', () => {
  //if not selected an language
  if (!selectedExt) {
    setStatus('error', 'Debugging failed', 'Select a language before uploading.')
    return false;
  };
  //clear errors
  setStatus();
})
// Supported Extension list.
const supportedExtensions = ["py", "js", "html", "css"]

async function handleFile(file) {
  try {
    // Run file error handler
    if (!fileLogger(file)) return false;
    
    // File's Extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
      // checks if selectedExt is auto
    if (selectedExt === "auto") {
      // Checks if Extension is supported
      if (!supportedExtensions.includes(fileExtension)) throw new Error('File Extension not supported by our service')
    }
    // Else checks if not supported
    else if (fileExtension !== selectedExt) throw new Error(`File Extension not supported by the language you have selected (.${selectedExt})`);
    
    // Get file data
    const fileNameLabel = document.getElementById('fileName');
    const fileIcon = document.getElementById('fileIcon');
    const fileSize = formatFileSize(file.size)
    
    // Sets file data
    fileNameLabel.textContent = file.name + ` (${fileSize})`;
    fileIcon.classList.remove('fa-solid', 'fa-upload')
    fileIcon.classList.add('bx', 'bx-file-code');
    
    // Gets the text of the file
    const code = await file.text();
    
    // stores it in the browser
    sessionStorage.setItem("code", code);
  } catch(error) {
    setStatus('error', 'File Uploader Failed', error);
    console.error('An error occured while uploading file: ' + error);
  }
}

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileUploader');
//when user drags a file
uploadZone.addEventListener('dragover', (event) => {
  //prevents the default
  event.preventDefault();
  uploadZone.classList.add('drag-over');
});

//When user leaves the file
uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

//When it drops the file
uploadZone.addEventListener('drop', (event) => {
  //Prevent default action
  event.preventDefault();
  
  uploadZone.classList.remove('drag-over');
  
  // handle the file
  handleFile(event.dataTransfer.files[0]);
});

//When uploads a file via click
fileInput.addEventListener('change', () => {
  // handle the file
  handleFile(fileInput.files[0]);
});

//Stores the input of the textarea
textInput.addEventListener("change", function() {
  const code = this.value;
  sessionStorage.setItem("code", code)
});

//Sends an alert on usage of html
const htmlSelector = document.getElementById('html');
htmlSelector.addEventListener("click", () => {
  setStatus("info", "General Information", "Using html does not automatically debug the style & script elements inside the html, you need to redebug them in their respective types.")
});

//Custom editor like textarea lines
let textareasHere = Array.from(document.querySelectorAll(".textarea-div > textarea"));
for (let i = 0; i < textareasHere.length; i++) {
  if (i != 0 && i % 2 == 1) {
    textareasHere[i].addEventListener("scroll", function(e) {
      textareasHere[i - 1].scrollTop = textareasHere[i].scrollTop;
      textareasHere[i - 1].scrollLeft = textareasHere[i].scrollLeft;
    });
    textareasHere[i].addEventListener("input", function(e) {
      textareasHere[i - 1].textContent = "";
      const numberOfLinesHere = Math.max(textareasHere[i].value.split("\n").length, 1);
      for (let h = 0; h < numberOfLinesHere; h++) {
        textareasHere[i - 1].textContent += (h + 1).toString() + "\n";
      }
      textareasHere[i - 1].setAttribute("cols", numberOfLinesHere.toString().length.toString());
    });
    const numberOfLinesHereZ = Math.max(textareasHere[i].value.split("\n").length, 1);
    for (let h = 0; h < numberOfLinesHereZ; h++) {
      textareasHere[i - 1].textContent += (h + 1).toString() + "\n";
    }
    textareasHere[i - 1].setAttribute("cols", numberOfLinesHereZ.toString().length.toString());
  }
}

//sets the results function
function setDebuggerContext(report, error, type) {
  //context used
  let context;
  
  if (type === "Html") {
    context = `${report[error].evidence}\n\n\nError: ${report[error].message} | ${report[error].line}:${report[error].col}`;
  } else if (type === "Css") {
    context = `${report.results[error].warnings[0].rule}\n\n\nError: ${report.results[error].warnings[0].text} | ${report.results[error].warnings[0].line}:${report.results[error].warnings[0].column}`
  } else if (type === "Java Script") {
    context = `Error: ${report[0].messages[error].message} | ${report[0].messages[error].line}:${report[0].messages[error].column}`
  } else if (type === "Python") {
    context = `Error: ${report}`;
  }
  //returns it to the sender
  return context;
}

resultsBtn.addEventListener('click', async () => {
  try {
    toggleLoader(true);
    
    const resultsDiv = document.getElementById('resultsContainer');
    const type = document.getElementById('dropdownSelected').dataset.selected.trim();
    const code = sessionStorage.getItem("code");
    //runs error handler
    if (!errorLoggerBEFORE(type, code)) {
      resultsDiv.style.display = "none";
      return;
    };
  
    //sends the api request to the end point
    let results;
    const res = await fetch('/api/debugger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, code }),
    });
    
    if (!res) throw new Error('Server is unreachable please try later.');
    
    // checks if response is an valid json
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      throw new Error('Unexpected server response.');
      
      const text = res.text();
      console.error('An unexpected response from the server.\n\nRESPONSE: ' + text);
    };
    
    if (!res.ok) {
      const errorMessage = ((await res.json()).message) || "An unknown error occured.";
      throw new Error(errorMessage);
    };
    //Gets the data
    const data = await res.json();
    
    if (!data) throw new Error('The response from our server was empty, retry debugging.')
  
    //Get the error report & log it
    const report = data.report;
    console.dir(data);
  
    //Let the default count be 0
    let errorCount = 0;
  
    if (type === "Html") {
      errorCount = report.filter(item => typeof item === "object" && !Array.isArray(item) && item !== null).length
    } else if (type === "Css") {
      errorCount = report.results.filter(item => typeof item === "object" && !Array.isArray(item) && item !== null).length;
    } else if (type === "Java Script") {
      errorCount = report[0].errorCount
    } else if (type === "Python") {
      if (report) errorCount = 1;
    }
  
    //if no errors found end
    if (errorCount === 0) {
      setStatus('success', 'No errors found', "No errors were detected in you're given code.");
      resultsDiv.style.display = "none";
      return;
    };
  
    //stores the report for future in the broswer
    sessionStorage.setItem("report", JSON.stringify(report));
  
    //Sets the arrows
    const arrows = document.querySelectorAll('.arrows');
  
    //removes the disabled
    arrows.forEach((arrow) => arrow.classList.remove('disabled') );
    //if one error disable both
    if (errorCount === 1) {
      arrows.forEach((arrow) => arrow.classList.add('disabled') );
    }
  
    const errorGoBack = document.getElementById('errorGoBack');
    errorGoBack.classList.add('disabled');
  
    //set the total error count
    const totalErrors = document.getElementById('totalErrors');
    totalErrors.textContent = `${errorCount}`;
  
    const resultsInput = document.getElementById('results');
    const errorContext = setDebuggerContext(report, 0, type);
    //sets the error
    resultsInput.value = errorContext;
  
    //refreshes line numbers
    for (let i = 0; i < textareasHere.length; i++) {
      if (i != 0 && i % 2 == 1) {
        textareasHere[i - 1].textContent = "1\n";
        const numberOfLinesHereZ = Math.max(textareasHere[i].value.split("\n").length, 1);
        for (let h = 1; h < numberOfLinesHereZ; h++) {
          textareasHere[i - 1].textContent += (h + 1).toString() + "\n";
        }
        textareasHere[i - 1].setAttribute("cols", numberOfLinesHereZ.toString().length.toString());
      }
    }
  
    //Enables the output display
    resultsDiv.style.display = "flex";
  } catch (error) {
    console.error('An error occurred while debugging your code: ' + error);
    setStatus('error', 'Debugger Failed', error);
  } finally {
    toggleLoader(false);
  };
});

const errorGoForward = document.getElementById('errorGoForward');
const errorGoBack = document.getElementById('errorGoBack');

//Next error button
errorGoForward.addEventListener("click", () => {
  const currentError = document.getElementById('currentError');
  const totalErrors = document.getElementById('totalErrors');
  
  //if its meets a 1 error count return
  if (currentError.textContent === totalErrors.textContent) return;
  
  //enable the previous error button
  errorGoBack.classList.remove('disabled');
  
  //increases & sets the error count
  let currentValue = parseInt(currentError.textContent) + 1;
  currentError.textContent = `${currentValue}`;
  
  if (currentError.textContent === totalErrors.textContent) errorGoForward.classList.add('disabled');
  
  //Gets the report
  const resultsInput = document.getElementById('results');
  const report = JSON.parse(sessionStorage.getItem("report"));
  
  //sets the new report
  const errorContext = setDebuggerContext(report, currentValue - 1, type);
  
  resultsInput.value = errorContext;
});

//previous error button
errorGoBack.addEventListener("click", () => {
  const currentError = document.getElementById('currentError');
  const totalErrors = document.getElementById('totalErrors');
  
  //if meets a 1 error count return
  if (currentError.textContent === "1") return;
  
  //enables next error button
  errorGoForward.classList.remove('disabled');
  
  //decreases & sets the error count
  let currentValue = parseInt(currentError.textContent) - 1;
  currentError.textContent = `${currentValue}`;
  
  if (currentError.textContent === "1") errorGoBack.classList.add('disabled');
  
  //gets the report
  const resultsInput = document.getElementById('results');
  const report = JSON.parse(sessionStorage.getItem("report"));
  
  //sets the new report
  const errorContext = setDebuggerContext(report, currentValue - 1, type);
  
  resultsInput.value = errorContext;
});
