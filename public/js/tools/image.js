//Imports the required functions
import { setAlert, fileLogger } from "../handlers/errorLogger.js";
import {} from "../handlers/dropDownMenu.js";
import { formatFileSize, afterTransition } from "../handlers/utils.js";
import Cropper from "https://unpkg.com/cropperjs@1.6.2/dist/cropper.esm.js";

// Placeholder for image
let image = null;
let cropper = null;

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

async function handleFile(file) {
  // if same image return
  if (file === image) return;
  try {
    // Run file error handler
    if (!fileLogger(file)) return false;
    
    // checks if its an image
    if (!file.type.startsWith('image/')) throw new Error('The uploaded file is not an usable image.');
    
    // Sets file data
    document.getElementById('fileName').textContent = 'Reupload Image';
    
    // save the image
    image = file;
    
    // Setup the showcase image
    const imageShowcase = document.getElementById('imageShowcase');
    imageShowcase.src = URL.createObjectURL(file);
    
    // Enable the container
    document.getElementById('imageShowcaseContainer').style.display = "flex";
    // Set file name
    document.getElementById('imageShowcaseName').textContent = file.name;
    // Set the info
    document.getElementById('mimeField').textContent = file.type;
    document.getElementById('sizeField').textContent = formatFileSize(file.size);
    const bitmap = await createImageBitmap(file);
    document.getElementById('resolutionField').textContent = bitmap.width + 'x' + bitmap.height;
    const fileModifiedDate = new Date(file.lastModified);
    document.getElementById('lastModifiedField').textContent = `${fileModifiedDate.getDate()}/${fileModifiedDate.getMonth() + 1}/${fileModifiedDate.getFullYear()}`;
    
    // Revoke the url after the image loads
    imageShowcase.onload = () => URL.revokeObjectURL(imageShowcase.src);
    console.dir(file)
    // Assign the image to the cropper menu
    const cropperImage = document.getElementById('cropperImage');
    // Assign the url & remove it after it loads
    cropperImage.src = URL.createObjectURL(file);
    
    // if cropper is already constructed replace the image
    if (cropper) cropper.replace(cropperImage.src);
    // else construct a new Cropper
    else {
      cropperImage.onload = () => {
        // Initialize the cropper
        cropper = new Cropper(document.getElementById('cropperImage'), {
          viewMode: 1,
          rotatable: false,
          scalable: false,
          zoomable: false,
          movable: false,
          background: false,
          responsive: true,
          restore: true,
          autoCrop: false
        });
        // Ensure url is revoked after cropper loads
        cropperImage.addEventListener('ready', () => URL.revokeObjectURL(cropperImage.src));
      }
    }
  } catch(error) {
    setAlert('error', 'Image Uploader Failed', error);
    console.error('An error occured while uploading the image: ' + error);
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
fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

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

document.getElementById('cropMenuButton').addEventListener("click", () => {
  const loader = document.getElementById('cropperMenu').querySelector('.loader-fallback');
  try {
    loader.style.display = "flex";
    
    const cropperContainer = document.getElementById('cropperMenuContainer');
    const cropperMenu = document.getElementById('cropperMenu');
    
    // Apply the noContentFallback
    const noContentFallback = cropperMenu.querySelector('.no-content-fallback');
    if (!image) {
      noContentFallback.style.display = "flex";
      cropperMenu.querySelector('.image-container').style.display = "none";
    }
    
    // Show the menu
    cropperContainer.classList.add('active');
    cropperMenu.classList.add('active');
  } catch(error) {
    setAlert('error', 'Image Converter Failed', error);
    console.log('Failed to convert image: ' + error)
  } finally {
    loader.style.display = "none";
  }
});

document.getElementById('cropperCloseButton').addEventListener("click", () => {
  const cropperContainer = document.getElementById('cropperMenuContainer');
  const cropperMenu = document.getElementById('cropperMenu');
  
  // Close the menu
  cropperContainer.classList.remove('active');
  cropperMenu.classList.remove('active');
  
  // Close the fallbacks once transition is complete
  afterTransition(cropperMenu, event => {
    if (event.target !== cropperMenu) return;
    // Enable the content
    cropperMenu.querySelector('.image-container').style.display = "flex";
    
    cropperMenu.querySelector('.no-content-fallback').style.display = "none";
    cropperMenu.querySelector('.loader-fallback').style.display = "none";
  });
});

document.getElementById('clearButton').addEventListener("click", () => cropper.clear());

document.getElementById('cropperImage').addEventListener("crop", event => {
  const data = event.detail;
  
  // update the values
  document.getElementById('xField').textContent = data.x.toFixed(2);
  document.getElementById('yField').textContent = data.y.toFixed(2);
  document.getElementById('widthField').textContent = data.width.toFixed(2);
  document.getElementById('heightField').textContent = data.height.toFixed(2);
})

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
    const quality = (document.getElementById('qualityRange') || 0).value / 100;
  
    // Runs the error handler
    if (!type) throw new Error('No converter file-type selected!');
    if (!quality) throw new Error('No converter quality specified!');
    if (!image) throw new Error('No Image uploaded!');
    
    // start conversion process
    // creates a bitmap of the image
    const bitmap = await createImageBitmap(image);
    
    // Get the customization options
    const data = cropper.getData();
    
    const resizeX = document.getElementById('resizeXInput').value || bitmap.width || 0;
    const resizeY = document.getElementById('resizeYInput').value || bitmap.height || 0;
    
    const cropX = data.x || 0;
    const cropY = data.y || 0;
    const cropWidth = data.width || bitmap.width || 0;
    const cropHeight = data.height || bitmap.height || 0;
    
    // creates an temporary canvas to draw the image
    const canvas = document.createElement('canvas');
    // Set the size of the canvas relative to image(bitmap)
    canvas.width = resizeX;
    canvas.height = resizeY;
    
    // Get the context to draw the image
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, cropX, cropY, cropWidth, cropHeight, 0, 0, resizeX, resizeY);
    
    // finally convert the image in the canvas by redrawing it in the specified format
    const blob = await new Promise(res => canvas.toBlob(res, `image/${type}`, quality));
    if (!blob) throw new Error("Image blob couldn't be created.");
    
    console.log('Successfully converted image: ');
    console.dir(blob);
    
    // Create an download link
    downloadUrl = URL.createObjectURL(blob);
    
    // Assign the url to the download button
    const downloadButton = document.getElementById('imageDownloadButton');
    const sanitizedFileName = image.name.replace(/\.[^/.]+$/, "");
    downloadButton.style.display = "flex";
    downloadButton.href = downloadUrl;
    downloadButton.download = `${sanitizedFileName}-hexion-${type}-${Math.random()}`;
    
    // Assign it to image previwer
    const imagePreviewer = document.getElementById('imagePreviewer')
    imagePreviewer.src = URL.createObjectURL(blob);
    imagePreviewer.onload = () => URL.revokeObjectURL(imagePreviewer.src);
    document.getElementById('imagePreviewerContainer').style.display = "flex";
  } catch(error) {
    setAlert('error', 'Image Converter Failed', error);
    console.error('Failed to convert image: ' + error);
    downloadButton.style.display = "none";
  } finally {
    toggleLoader(false);
  };
});
