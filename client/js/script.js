const uploadArea = document.querySelector(".upload-area");
const fileCount = document.querySelector(".upload-area__count");
const fileInput = document.querySelector(".upload-area__input");
const fileList = document.querySelector(".upload-list");
const fileSubmit = document.querySelector(".upload-button--green");
const fileReset = document.querySelector(".upload-button--red");

const URL = "http://localhost:4444";
let filesToUpload = [];

fileCount.innerText = 0;

function uploadFiles(files) {
  let countUploads = 0;

  files.forEach((file) => {
    const item = document.createElement("div");
    const itemName = document.createElement("p");
    const progress = document.createElement("div");
    const progressBar = document.createElement("div");
    const progressBarFill = document.createElement("div");
    const percent = document.createElement("p");

    itemName.innerText = file.name;

    item.classList.add("list-item");
    itemName.classList.add("list-item__title");
    progress.classList.add("list-item__progress");
    progressBar.classList.add("list-item__progress--gray");
    progressBarFill.classList.add("list-item__progress--blue");
    percent.classList.add("list-item__progress--percent");

    progressBar.appendChild(progressBarFill);
    progress.append(progressBar, percent);
    item.append(itemName, progress);
    fileList.appendChild(item);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", URL + "/upload", true);

   

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;

        progressBarFill.style.width = percentComplete + "%";
        percent.innerText = percentComplete.toFixed() + "%";

        if (percentComplete === 100) {

          xhr.addEventListener("load", () => {
            console.log("load", countUploads);
      
            if (xhr.status === 200) {
              progressBarFill.classList.add("list-item__progress--green");
            } else {
              progressBarFill.classList.add("list-item__progress--red");
            }
      
            if (countUploads === files.length) {
              fileCount.innerText = filesToUpload.length;
              uploadFilesSlices();
            }
          });
          console.log(100);
          countUploads += 1;
        }
      }
    });

    xhr.addEventListener("error", () => {
      console.log("err");
      progressBarFill.classList.add("list-item__progress--red");
    });

    xhr.send(formData);
  });
}

function uploadFilesSlices() {
  let sliceFiles = [];

  if (filesToUpload.length === 0) {
    buttonDisabled(fileReset, false);
    uploadArea.classList.remove("upload-area--red");
    return;
  } else if (filesToUpload.length > 3) {
    sliceFiles = filesToUpload.slice(0, 3);
    filesToUpload = filesToUpload.slice(3);
  } else {
    sliceFiles = [...filesToUpload];
    filesToUpload = [];
  }

  uploadFiles(sliceFiles);
}

function resetFile() {
  filesToUpload = [];
  fileCount.innerText = 0;
  fileList.innerHTML = "";

  uploadArea.classList.remove("upload-area--red");

  buttonDisabled(fileSubmit, true);
  buttonDisabled(fileReset, true);
}

function submitFiles() {
  buttonDisabled(fileSubmit, true);
  buttonDisabled(fileReset, true);

  uploadArea.classList.add("upload-area--red");

  uploadFilesSlices();
}

function addUploadFiles(files) {
  filesToUpload = [...filesToUpload, ...Array.from(files)];
  fileCount.innerText = filesToUpload.length;

  if (filesToUpload.length > 0) {
    buttonDisabled(fileSubmit, false);
    buttonDisabled(fileReset, false);
  }
}

function buttonDisabled(button, boolean) {
  button.disabled = boolean;
  button.classList.toggle("upload-button--disabled", boolean);
}

fileInput.addEventListener("change", (e) => addUploadFiles(e.target.files));

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("upload-area--gray");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("upload-area--gray");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();

  uploadArea.classList.remove("upload-area--gray");
  addUploadFiles(e.dataTransfer.files);
});

fileReset.addEventListener("click", resetFile);
fileSubmit.addEventListener("click", () => submitFiles(true));
