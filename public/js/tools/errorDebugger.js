//Import required functions
import { setAlert, fileLogger } from '../handlers/errorLogger.js';
import {} from '../handlers/copy.js'
import { formatFileSize } from '../handlers/utils.js'
import { setFunction } from '../handlers/dropDownMenu.js'

// Supported Extension list.
const supportedExtensions = ["py", "js", "html", "css"]

// Placeholders
let code;
let report = null;

let selectedExtension = "auto";
let fileExtension = null;

function clearFile() {
  document.getElementById('fileUploader').value = null;
  
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  
  // clear file data
  fileNameLabel.textContent = 'Upload File';
  fileIcon.classList.remove('bx', 'bx-file-code');
  fileIcon.classList.add('fa-solid', 'fa-upload');
  
  fileExtension = null;
  code = null;
}

function selectExtension() {
  // hide all options
  document.querySelectorAll('.option-container').forEach(option => option.style.display = "none");
  
  const type = document.getElementById('dropdownSelected').dataset.selected.toLowerCase().trim();
  
  switch (type) {
    case 'auto':
      // show all options
      document.querySelectorAll('.option-container').forEach(option => option.style.display = "flex");
      selectedExtension = type;
      break;
    case 'html':
    case 'css':
      selectedExtension = type;
      break;
    case 'java script':
      selectedExtension = 'js';
      // Enable js options
      document.querySelectorAll('.js-option').forEach(option => option.style.display = "flex");
      break;
    case 'python':
      selectedExtension = 'py';
      break;
    default:
      selectedExtension = type;
      break;
  };
  
  if (!fileExtension) return clearFile();
  
  // Check if currently uploaded file is compliant
  if (selectedExtension === "auto") {
    
    // Check if Extension is supported
    if (!supportedExtensions.includes(fileExtension)) clearFile();
  } else if (selectedExtension !== fileExtension) clearFile();
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

// When file mode deactivates remove data
fileMode.addEventListener("click", function() {
  // if current selected ignore
  if (this.classList.contains('selected')) return;
  
  auto.classList.remove('disable');
  
  textInput.value = null;
  code = null;
});

// When text mode deactivates remove data
textMode.addEventListener("click", function() {
  // if current selected ignore
  if (this.classList.contains('selected')) return;
  
  const auto = document.getElementById('auto');
  const html = document.getElementById('html');
  
  // Select html (if auto is currently selected)
  if (selectedExtension === "auto") {
    selectedExtension = "html";
    
    auto.classList.remove('selected');
    html.classList.add('selected');
    
    const htmlName = html.innerHTML;
    const dropdownText = document.getElementById('dropdownSelected');
    
    dropdownText.dataset.selected = "html";
    dropdownText.innerHTML = htmlName;
    
    // Disable All options that dont suppirt html
    document.querySelectorAll('.option-container:not(.html-option)').forEach(option => option.style.display = "none");
  };
  // Disable auto
  auto.classList.add('disable');
  
  clearFile();
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
  if (!selectedExtension) {
    setAlert('error', 'Debugging failed', 'Select a language before uploading.')
    return false;
  };
  //clear errors
  setAlert();
})


async function handleFile(file) {
  try {
    const selectedType = document.getElementById('dropdownSelected').dataset.selected.toLowerCase().trim();
    
    // Run file error handler
    if (!fileLogger(file)) return false;
    
    // File's Extension
    const rawFileExtension = file.name.split('.').pop().toLowerCase();
    if (
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/")
    ) throw new Error("Media files are not allowed.");

    // checks if selectedExtension is auto
    if (selectedType === "auto") {
      // Checks if Extension is supported
      if (!supportedExtensions.includes(rawFileExtension)) throw new Error('File Extension not supported by our service');
      selectedExtension = rawFileExtension;
    }
    // Else checks if not supported
    else if (fileExtension !== selectedExtension) throw new Error(`File Extension not supported by the language you have selected (.${selectedExtension})`);
    
    fileExtension = rawFileExtension;
    
    // Get file data
    const fileNameLabel = document.getElementById('fileName');
    const fileIcon = document.getElementById('fileIcon');
    const fileSize = formatFileSize(file.size)
    
    // Sets file data
    fileNameLabel.textContent = file.name + ` (${fileSize})`;
    fileIcon.classList.remove('fa-solid', 'fa-upload')
    fileIcon.classList.add('bx', 'bx-file-code');
    
    // Gets the text of the file
    const fileText = await file.text();
    
    // stores it in the browser
    code = fileText;
  } catch (error) {
    setAlert('error', 'File Uploader Failed', error);
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
  const textInputed = this.value;
  code = textInputed;
});

let textareasHere = Array.from(document.querySelectorAll(".textarea-div > textarea"));

function refreshLineNumbers() {
  // refreshes line numbers
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
}

//C ustom editor like textarea lines
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

// sets the results function
function setDebuggerContext(report, error, type) {
  // context used
  let context = "";
  if (report.mixedHtml) {
    if (report.html && report?.html[error]) context += `• HTML: ${report.html[error].evidence}\nError: ${report.html[error].message} | ${report.html[error].line}:${report.html[error].col}\n\n`;
    if (report.css && report?.css[0]?.warnings[error]) context += `• CSS: ${report.css[0].warnings[error].rule}\nError: ${report.css[0].warnings[error].text} | ${report.css[0].warnings[error].line}:${report.css[0].warnings[error].column}\n\n`;
    if (report.js && report?.js[0]?.messages[error]) context += `• JS: Error occured: \nError: ${report.js[0].messages[error].message} | ${report.js[0].messages[error].line}:${report.js[0].messages[error].column}\n`;
  } else if (type === "html") {
    context = `${report[error].evidence}\n\n\nError: ${report[error].message} | ${report[error].line}:${report[error].col}\n`;
  } else if (type === "css") {
    context = `${report[0].warnings[error].rule}\n\n\nError: ${report[0].warnings[error].text} | ${report[0].warnings[error].line}:${report[0].warnings[error].column}\n`;
  } else if (type === "js") {
    context = `Error: ${report[0].messages[error].message} | ${report[0].messages[error].line}:${report[0].messages[error].column}\n`;
  } else if (type === "py") {
    context = `Error: ${report}\n`;
  }
  // returns it to the sender
  return context;
}

resultsBtn.addEventListener('click', async () => {
  toggleLoader(true);
  
  try {
    const resultsDiv = document.getElementById('resultsContainer');
    const type = selectedExtension.toLowerCase();
    // default options object(empty)
    const options = {
      isNodejs: false,
    };
    
    const optionCheckboxes = document.querySelectorAll('.toggle');
    
    
    optionCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked || checkbox.dataset.format !== type) return;
    
      const optionType = checkbox.dataset.type;
      options[optionType] = true;
    });
    
    // runs error handler
    if (!type || !code) {
      resultsDiv.style.display = "none";
      
      setAlert('error', 'Debugger failed', 'Please fill in all the fields.');
      return;
    };
    
    // auto checker
    if (type === "auto") throw new Error("No extension resolved, upload an file.");
  
    // sends the api request to the end point
    const res = await fetch('/api/debugger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, code, options }),
    });
    
    if (!res) throw new Error('Server is unreachable please try later.');
    
    // checks if response is an valid json
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('An unexpected response from the server.\n\nRESPONSE: ' + text);
      
      throw new Error('Unexpected server response.');
    };
    
    if (!res.ok) {
      const errorMessage = ((await res.json()).message) || "An unknown error occured.";
      throw new Error(errorMessage);
    };
    
    // Gets the data
    const data = await res.json();
    
    if (!data) throw new Error('The response from our server was empty, retry debugging.');
  
    // Get the error report & log it
    let fileReport = data.report;
    console.dir(data.report);
  
    // Let the default count be 0
    let errorCount = 0;
    
    if (fileReport.mixedHtml) {
      const htmlErrorCount = fileReport.html?.filter(item => typeof item === "object" && !Array.isArray(item) && item !== null).length ?? 0;
      const cssErrorCount = fileReport.css?.filter(item => typeof item === "object" && !Array.isArray(item) && item !== null).length ?? 0;
      const jsErrorCount = fileReport.js[0]?.errorCount ?? 0;
      
      errorCount = Math.max(htmlErrorCount, cssErrorCount, jsErrorCount);
      
      // If no errors in css and js just make it a simple html debug report
      if (htmlErrorCount && !cssErrorCount && !jsErrorCount) {
        delete fileReport.css;
        delete fileReport.js;
        delete fileReport.mixedHtml;
        fileReport = fileReport.html;
      }
    } else if (type === "html") {
      errorCount = fileReport.filter(item => typeof item === "object" && !Array.isArray(item) && item !== null).length;
    } else if (type === "css") {
      errorCount = fileReport.filter(item => typeof item === "object" && !Array.isArray(item) && item !== null).length;
    } else if (type === "js") {
      errorCount = fileReport[0].errorCount;
    } else if (type === "py") {
      if (fileReport) errorCount = 1;
    }
  
    // if no errors found end
    if (errorCount === 0) {
      setAlert('success', 'No errors found', "No errors were detected in you're given code.");
      resultsDiv.style.display = "none";
      return;
    };
  
    // stores the report for future in the broswer
    report = fileReport;
  
    // Sets the arrows
    const arrows = document.querySelectorAll('.arrows');
  
    // removes the disabled
    arrows.forEach((arrow) => arrow.classList.remove('disabled'));
    // if one error disable both
    if (errorCount === 1) arrows.forEach((arrow) => arrow.classList.add('disabled'));
  
    const errorGoBack = document.getElementById('errorGoBack');
    errorGoBack.classList.add('disabled');
  
    // set the total error count
    const totalErrors = document.getElementById('totalErrors');
    totalErrors.textContent = `${errorCount}`;
  
    const resultsInput = document.getElementById('results');
    const errorContext = setDebuggerContext(fileReport, 0, type);
    // sets the error
    resultsInput.value = errorContext;
    
    refreshLineNumbers();
  
    // Enables the output display
    resultsDiv.style.display = "flex";
  } catch (error) {
    console.error('An error occurred while debugging your code: ' + error);
    setAlert('error', 'Debugger Failed', error);
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
  
  //sets the new report
  const errorContext = setDebuggerContext(report, currentValue - 1, selectedExtension);
  
  resultsInput.value = errorContext;
  
  refreshLineNumbers();
});

//previous error button
errorGoBack.addEventListener("click", () => {
  const currentError = document.getElementById('currentError');

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
  
  //sets the new report
  const errorContext = setDebuggerContext(report, currentValue - 1, selectedExtension);
  
  resultsInput.value = errorContext;
  
  refreshLineNumbers();
});
