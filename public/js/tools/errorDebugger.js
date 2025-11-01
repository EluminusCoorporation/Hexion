import { setStatus, errorLoggerBEFORE, fileLogger } from '../api/errorLogger.js';
import {} from '../api/copy.js'
import { formatFileSize } from '../api/fileSizeFormat.js'
import { selectedExt } from '../api/dropDownMenu.js'
const resultsBtn = document.getElementById('results-btn');
const dBtn1 = document.getElementById('dbtn1');
const dBtn2 = document.getElementById('dbtn2');
const buttons = document.querySelectorAll('.dualbtn');
const uploadbtn = document.getElementById('uploadZone');
const textinput = document.getElementById('textmodetxt')
const btnindicator = document.getElementById('btnIndicator')
const uploadWrapper = document.getElementById('uploadWrapper')

buttons.forEach((btn, index) => {
  dBtn1.classList.add('selected')
  btn.addEventListener('click', () => {
    if (btn.classList.contains('selected')) return;
    btnindicator.style.left = index === 0 ? '0%' : '50%';
    buttons.forEach(b => b.classList.remove('selected'));
    if (index === 0) {
      textinput.classList.remove('selected');
      uploadWrapper.classList.add('selected');
    }
    else {
      uploadWrapper.classList.remove('selected');
      textinput.classList.add('selected');
    }
    btn.classList.add('selected');
  });
});

uploadbtn.addEventListener('click', () => {
  if (!selectedExt) {
    setStatus('error', 'Debugging failed', 'Select a language before uploading.')
    return false;
  };
  setStatus('');
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

uploadZone.addEventListener('drop', (event) => {
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
  
  sessionStorage.setItem("errorDebuggerFile", file)
  let data = sessionStorage.getItem("errorDebuggerFile")
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!fileLogger(file)) return false;
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  const fileSize = formatFileSize(file.size)
  
  fileNameLabel.textContent = file.name + ` (${fileSize})`;
  fileIcon.classList.remove('fa-solid', 'fa-upload')
  fileIcon.classList.add('bx', 'bx-file-code');
  
  sessionStorage.setItem("errorDebuggerFile", file)
  let data = sessionStorage.getItem("errorDebuggerFile")
});

const htmlSelector = document.getElementById('html');
htmlSelector.addEventListener("click", () => {
  setStatus("info", "General Information", "Using html does not automatically debug the style & script elements inside the html, you need to redebug them in their respective types.")
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

resultsBtn.addEventListener('click', function() {
  const name = document.getElementById('dropdown-text').textContent.trim();
  const code = document.getElementById('textmodetxt').value;
  if (!errorLoggerBEFORE(name, code)) {
    return
  };
  
  let results;
  
  function debuggingCode(name, text) {
    if (name === "Html") {
      
    }
    resultsInput.value = results;
    return
  };
  const resultsInput = document.getElementById('results');
  const resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  debuggingCode(name, code);
});