const URL = "http://localhost:8080";
let filesToUpload = [];
let uploadFinishCount = 0;
let success = 0;
let failed = 0;

const uploadArea = document.querySelector(".upload-area");
const successCount = document.querySelector(".upload-counts__count--green");
const failedCount = document.querySelector(".upload-counts__count--red");
const pendingCount = document.querySelector(".upload-counts__count--orange");
const fileInput = document.querySelector(".upload-area__input");
const fileList = document.querySelector(".upload-list");
const fileSubmit = document.querySelector(".upload-button--green");
const fileReset = document.querySelector(".upload-button--red");

successCount.innerText = success;
failedCount.innerText = failed;
pendingCount.innerText = 0;

function uploadFiles(file, progressBarFill, percent, callback) {
  const formData = new FormData();
  formData.append("file", file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", URL + "/upload", true);

  xhr.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;

      progressBarFill.style.width = percentComplete + "%";
      percent.innerText = percentComplete.toFixed() + "%";
    }
  });

  xhr.addEventListener("load", () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
      callback(undefined, true);
    } else {
      callback(true, undefined);
    }
  });

  xhr.send(formData);
}

function createProgressBar(file, arr) {
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

  function callBack(err, data) {
    if (data) {
      progressBarFill.classList.add("list-item__progress--green");
      successCount.innerText = ++success;
      uploadFinishCount += 1;
    } else if (err) {
      progressBarFill.classList.add("list-item__progress--red");
      failedCount.innerText = ++failed;
      uploadFinishCount += 1;
    }

    if (uploadFinishCount === arr.length) {
      uploadFinishCount = 0;
      pendingCount.innerText = filesToUpload.length;
      uploadFilesSlices();
    }
  }

  uploadFiles(file, progressBarFill, percent, callBack);
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

  sliceFiles.forEach((file, i, arr) => {
    createProgressBar(file, arr);
  });
}

function resetFile() {
  filesToUpload = [];
  success = 0;
  failed = 0;

  successCount.innerText = success;
  failedCount.innerText = success;
  pendingCount.innerText = filesToUpload.length;
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
  pendingCount.innerText = filesToUpload.length;

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
fileSubmit.addEventListener("click", submitFiles);
