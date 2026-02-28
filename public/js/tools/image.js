//Imports the required functions
import { setStatus ,fileLogger } from "../utils/errorLogger.js";
import {} from "../utils/dropDownMenu.js";

// Placeholder for image
let image = null;

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileUploader');
// when user drags a file
uploadZone.addEventListener('dragover', (event) => {
  //prevents the default
  event.preventDefault();
  uploadZone.classList.add('drag-over');
});

// When user leaves the dragged file
uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

function handleFile(file) {
  try {
    // Run file error handler
    if (!fileLogger(file)) return false;
    
    // checks if its an image
    if (!file.type.startsWith('image/')) throw new Error('The uploaded file is not an usable image.');
    
    // Sets file data
    document.getElementById('fileName').textContent = 'Reupload Image';
    
    // save the image
    image = file;
    
    // Sets the showcase image
    const imageShowcase = document.getElementById('imageShowcase');
    imageShowcase.src = URL.createObjectURL(file);
    imageShowcase.style.display = "flex";
    // Revoke the url after the image loads
    imageShowcase.onload = () => URL.revokeObjectURL(imageShowcase.src);
  } catch(error) {
    setStatus('error', 'Image Uploader Failed', error);
    console.error('An error occured while uploading the image: ' + error)
  }
}

// When user drops the dragged file
uploadZone.addEventListener('drop', (event) => {
  // Prevent default action
  event.preventDefault();
  uploadZone.classList.remove('drag-over');
  
  // handle the image
  handleFile(event.dataTransfer.files[0]);
});

//When uploads a file via click
fileInput.addEventListener('change', () => {
  // handle the image
  handleFile(fileInput.files[0]);
});

document.getElementById('imageShowcase').addEventListener("error", function() {
  this.style.display = "none";
});

const ranges = document.querySelectorAll('.ranges');
ranges.forEach(range => {
  range.addEventListener("input", function() {
    const rangeContainer = this.parentNode;
    const rangeProgress = rangeContainer.querySelector('.range-progress');
    rangeProgress.textContent = this.value + '%';
  });
});

const resultsBtn = document.getElementById("results-btn");

// Create an temporary downloadUrl variable
let downloadUrl = null;

//Makes an event listener for results button
resultsBtn.addEventListener("click", async function () {
  try {
    toggleLoader(true);
    
    // revoke any old image download url
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    
    // Gets the format type
    const type = document.getElementById("dropdownSelected").dataset.selected.toLowerCase();
    // convert the value to 0-1 instead of 25-100%
    const quality = document.getElementById('qualityRange').value / 100;
    
    const resizeX = document.getElementById('resizeXInput').value || null;
    const resizeY = document.getElementById('resizeYInput').value || null;
    const cropX = document.getElementById('resizeXInput').value || null;
    const cropY = document.getElementById('resizeYInput').value || null;
  
    // Runs the error handler
    if (!type) throw new Error('No converter file-type selected!');
    if (!quality) throw new Error('No converter quality specified!');
    if (!image) throw new Error('No Image uploaded!');
    
    // start conversion process
    // creates a bitmap of the image
    const bitmap = await createImageBitmap(image);
    
    // creates an temporary canvas to draw the image
    const canvas = document.createElement('canvas');
    // set the size of the canvas relative to image(bitmap)
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    
    // Get the context to draw the image
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, null, null, cropX, cropY, null, null, resizeX, resizeY);
    
    // finally convert the image in the canvas by redrawing it in the specified format
    const blob = await new Promise(res => canvas.toBlob(res, `image/${type}`, quality));
    console.log('Successfully converted image: ' + blob);
    
    // Create an download link
    downloadUrl = URL.createObjectURL(blob);
    
    // Assign the url to the download button
    const downloadButton = document.getElementById('imageDownloadButton');
    const sanitizedFileName = image.name.replace(/\.[^/.]+$/, "");
    downloadButton.style.display = "flex";
    downloadButton.href = downloadUrl;
    downloadButton.download = sanitizedFileName + '-convertedTo-' + type;
  } catch(error) {
    setStatus('error', 'Image Converter Failed', error);
    console.error('Failed to convert image: ' + error);
    downloadButton.style.display = "none";
  } finally {
    toggleLoader(false);
  }
});
