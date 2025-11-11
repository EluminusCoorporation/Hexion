import { setStatus, errorLoggerBEFORE, fileLogger } from '../api/errorLogger.js';
import {} from '../api/copy.js'
import { formatFileSize } from '../api/fileSizeFormat.js'
import { selectedExt, setSelectedExt } from '../api/dropDownMenu.js'
const resultsBtn = document.getElementById('results-btn');
const fileMode = document.getElementById('fileMode');
const textMode = document.getElementById('textMode');
const buttons = document.querySelectorAll('.dualbtn');
const uploadbtn = document.getElementById('uploadZone');
const textInput = document.getElementById('textmodetxt');
const btnindicator = document.getElementById('btnIndicator')
const uploadWrapper = document.getElementById('uploadWrapper')

buttons.forEach((btn, index) => {
  fileMode.classList.add('selected');
  btn.addEventListener('click', function() {
    if (this.classList.contains('selected')) return;
    btnindicator.style.left = index === 0 ? '0%' : '50%';
    buttons.forEach(b => b.classList.remove('selected'));
    if (index === 0) {
      textInput.classList.remove('selected');
      uploadWrapper.classList.add('selected');
    }
    else {
      uploadWrapper.classList.remove('selected');
      textInput.classList.add('selected');
    }
    this.classList.add('selected');
  });
});

uploadbtn.addEventListener('click', () => {
  if (!selectedExt) {
    setStatus('error', 'Debugging failed', 'Select a language before uploading.')
    return false;
  };
  setStatus();
})

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileUploader');
// Click to open file dialog
uploadZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', async (event) => {
  event.preventDefault();
  uploadZone.classList.remove('drag-over');
  const files = event.dataTransfer.files;
  const file = files[0];
  if (!fileLogger(file)) return false;
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  const fileSize = formatFileSize(file.size)
  
  fileNameLabel.textContent = file.name + ` (${fileSize})`;
  fileIcon.classList.remove('fa-solid', 'fa-upload')
  fileIcon.classList.add('bx', 'bx-file-code');
  
  const code = await file.text();
  
  sessionStorage.setItem("code", code);
});

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!fileLogger(file)) return false;
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  const fileSize = formatFileSize(file.size)
  
  fileNameLabel.textContent = file.name + ` (${fileSize})`;
  fileIcon.classList.remove('fa-solid', 'fa-upload')
  fileIcon.classList.add('bx', 'bx-file-code');
  
  const code = await file.text()
  
  sessionStorage.setItem("code", code)
});

textInput.addEventListener("change", function() {
  const code = this.value;
  sessionStorage.setItem("code", code)
});

fileMode.addEventListener("click", () => {
  auto.classList.remove('deselect');
  textInput.value = null;
  sessionStorage.removeItem("code");
});

textMode.addEventListener("click", () => {
  const auto = document.getElementById('auto');
  const html = document.getElementById('html');
  if (selectedExt === "auto") {
    setSelectedExt("html");
    auto.classList.remove('selected');
    html.classList.add('selected');
    const htmlName = html.innerHTML;
    const dropdownText = document.getElementById('dropdown-text');
    dropdownText.innerHTML = htmlName;
    setStatus("info", "General Information", "Using html does not automatically debug the style & script elements inside the html, you need to redebug them in their respective types.");
  };
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  auto.classList.add('deselect');
  sessionStorage.removeItem('errorDebuggerFile');
  fileNameLabel.textContent = 'Upload File';
  fileIcon.classList.remove('bx', 'bx-file-code');
  fileIcon.classList.add('fa-solid', 'fa-upload');
  
  sessionStorage.removeItem("code");
});

const htmlSelector = document.getElementById('html');
htmlSelector.addEventListener("click", () => {
  setStatus("info", "General Information", "Using html does not automatically debug the style & script elements inside the html, you need to redebug them in their respective types.");
});

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

function setDebuggerContext(report, error, type) {
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
  return context;
}

resultsBtn.addEventListener('click', async () => {
  const resultsDiv = document.getElementById('resultsDiv');
  const type = document.getElementById('dropdown-text').textContent.trim();
  const code = sessionStorage.getItem("code");
  if (!errorLoggerBEFORE(type, code)) {
    resultsDiv.style.display = "none";
    return;
  };
  
  let results;
  const res = await fetch('/api/debugger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, code }),
  });
  const data = await res.json();
    
    
  if (data.success === false) {
    setStatus('error', 'An unexpected error occured', data.report)
    return;
  };
  
  const report = data.report;
  console.dir(data);
  
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
  
  if (errorCount === 0) {
    setStatus('success', 'No errors found', "No errors were detected in you're given code.");
    resultsDiv.style.display = "none";
    return;
  };
  
  sessionStorage.setItem("report", JSON.stringify(report));
  
  const arrows = document.querySelectorAll('.arrows');
  
  arrows.forEach((arrow) => arrow.classList.remove('disabled') );
  if (errorCount === 1) {
    arrows.forEach((arrow) => arrow.classList.add('disabled') );
  }
  
  const errorGoBack = document.getElementById('errorGoBack');
  errorGoBack.classList.add('disabled');
  
  const totalErrors = document.getElementById('totalErrors');
  totalErrors.textContent = errorCount;
  
  const resultsInput = document.getElementById('results');
  
  const errorContext = setDebuggerContext(report, 0, type);
  
  resultsInput.value = errorContext;
  
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
  
  resultsDiv.style.display = "flex";
});

const errorGoForward = document.getElementById('errorGoForward');
const errorGoBack = document.getElementById('errorGoBack');

errorGoForward.addEventListener("click", () => {
  const currentError = document.getElementById('currentError');
  const totalErrors = document.getElementById('totalErrors');
  
  if (currentError.textContent === totalErrors.textContent) return;
  
  errorGoBack.classList.remove('disabled');
  
  var currentValue = parseInt(currentError.textContent) + 1;
  currentError.textContent = currentValue;
  
  if (currentError.textContent === totalErrors.textContent) errorGoForward.classList.add('disabled');
  
  const resultsInput = document.getElementById('results');
  const report = JSON.parse(sessionStorage.getItem("report"));
  
  const errorContext = setDebuggerContext(report, currentValue - 1, type);
  
  resultsInput.value = errorContext;
});

errorGoBack.addEventListener("click", () => {
  const currentError = document.getElementById('currentError');
  const totalErrors = document.getElementById('totalErrors');
  
  if (currentError.textContent === "1") return;
  
  errorGoForward.classList.remove('disabled');
  
  var currentValue = parseInt(currentError.textContent) - 1;
  currentError.textContent = currentValue;
  
  if (currentError.textContent === "1") errorGoBack.classList.add('disabled');
  
  const resultsInput = document.getElementById('results');
  const report = JSON.parse(sessionStorage.getItem("report"));
  
  const errorContext = setDebuggerContext(report, currentValue - 1, type);
  
  resultsInput.value = errorContext;
});
