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

textinput.addEventListener("change", function() {
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
    const dropdownText = document.getElementById('dropdown-text');
    dropdownText.textContent = "Html"
  }
  const fileNameLabel = document.getElementById('fileName');
  const fileIcon = document.getElementById('fileIcon');
  auto.classList.add('deselect');
  sessionStorage.removeItem('errorDebuggerFile');
  fileNameLabel.textContent = 'Upload File';
  fileIcon.classList.remove('bx', 'bx-file-code');
  fileIcon.classList.add('fa-solid', 'fa-upload');
  
  sessionStorage.removeItem("code");
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
<<<<<<< Updated upstream
  const name = document.getElementById('dropdown-text').textContent.trim();
  const code = document.getElementById('textMode').value;
=======
  const type = document.getElementById('dropdown-text').textContent.trim();
  const code = sessionStorage.getItem("code");
>>>>>>> Stashed changes
  if (!errorLoggerBEFORE(name, code)) {
    return
  };
  
  let results;
  
  function debuggingCode(type, code) {
    
    resultsInput.value = results;
    return
  };
  const resultsInput = document.getElementById('results');
  const resultsDiv = document.getElementById('resultsDiv')
  resultsDiv.style.display = "flex";
  debuggingCode(type, code);
});