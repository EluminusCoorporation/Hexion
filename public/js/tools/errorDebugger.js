import { setError, errorLoggerBEFORE, fileLogger } from '../api/errorLogger.js';
import {} from '../api/copy.js'
import { formatFileSize } from '../api/fileSizeFormat.js'
import { selectedExt } from '../api/dropDownMenu.js'
var resultsBtn = document.getElementById('results-btn');
const dBtn1 = document.getElementById('dbtn1');
const dBtn2 = document.getElementById('dbtn2');
const buttons = document.querySelectorAll('.dualbtn');
const uploadbtn = document.getElementById('uploadZone');
const textinput = document.getElementById('textmodetxt')
const switcherContainer = document.getElementById('switcherContainer')
const btnindicator = document.getElementById('btnIndicator')
const uploadWrapper = document.getElementById('uploadWrapper')

buttons.forEach((btn, index) => {
  dBtn1.classList.add('selected')
  btn.addEventListener('click', () => {
    if (btn.classList.contains('selected')) return;
    btnindicator.style.left = index === 0 ? '0%' : '50%';
    buttons.forEach(b => b.classList.remove('selected'));
    if (index === 0) {
      switcherContainer.classList.toggle('selectedFunc')
      textinput.style.display = "none"
      uploadWrapper.style.display = "flex"
    }
    else {
      uploadWrapper.style.display = "none"
      textinput.style.display = "flex"
      switcherContainer.classList.toggle('selectedFunc')
    }
    btn.classList.add('selected');
  });
});

uploadbtn.addEventListener('click', () => {
  if (!selectedExt) {
    setError('Select a language before uploading.')
    return false;
  };
  setError('');
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
  var fileNameLabel = document.getElementById('fileName');
  var fileIcon = document.getElementById('fileIcon');
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
  var fileNameLabel = document.getElementById('fileName');
  var fileIcon = document.getElementById('fileIcon');
  const fileSize = formatFileSize(file.size)
  
  fileNameLabel.textContent = file.name + ` (${fileSize})`;
  fileIcon.classList.remove('fa-solid', 'fa-upload')
  fileIcon.classList.add('bx', 'bx-file-code');
  
  sessionStorage.setItem("errorDebuggerFile", file)
  let data = sessionStorage.getItem("errorDebuggerFile")
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
  var name = document.getElementById('dropdown-text').textContent.trim();
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
  var resultsInput = document.getElementById('results');
  var resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  debuggingCode(name, code);
});