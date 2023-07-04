const dropArea = document.querySelector(".upload-area");
const fileCount = document.querySelector(".upload-area__count");
const fileInput = document.querySelector(".upload-area__input");
const fileList = document.querySelector(".upload-list");
const fileSubmit = document.querySelector(".upload-btn--green");
const fileReset = document.querySelector(".upload-btn--red");

const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");
const modalText = document.querySelector(".modal__text");

const URL = "http://localhost:4444";
let filesToUpload = [];
let sliceFiles = [];

fileCount.innerText = 0;

function uploadFiles(file) {
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const item = document.createElement("div");
    item.classList.add("list-item");

    const itemName = document.createElement("p");
    itemName.classList.add("list-item__title");
    itemName.innerText = file.name;

    const progress = document.createElement("div");
    progress.classList.add("list-item__progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("list-item__progress--gray");

    const progressBarFill = document.createElement("div");
    progressBarFill.classList.add("list-item__progress--blue");

    progressBar.appendChild(progressBarFill);

    const percent = document.createElement("p");
    percent.classList.add("list-item__progress--percent");

    progress.append(progressBar, percent);
    item.append(itemName, progress);
    fileList.appendChild(item);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", URL + "/upload", true);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;

        progressBarFill.style.width = percentComplete + "%";
        percent.innerText = percentComplete.toFixed() + "%";
      }
    });

    xhr.addEventListener("error", () => {
      openModal("Upload failed for file: " + file.name, "red");
    });

    xhr.addEventListener("load", () => {
      if (xhr.status !== 200) {
        openModal(JSON.parse(xhr.responseText).message, "red");
      }
      resolve();
    });

    xhr.send(formData);
  })
    .catch((err) => openModal(err, "red"))
    .finally(() => {
      fileCount.innerText = 0;
      submitFiles();
    });
}

function resetFile() {
  filesToUpload = [];
  sliceFiles = [];
  fileCount.innerText = 0;

  submitStatus(true);
}

function submitFiles() {
  if (filesToUpload.length === 0) {
    submitStatus(true);
    return;
  } else if (filesToUpload.length > 3) {
    sliceFiles = filesToUpload.slice(0, 3);
    filesToUpload = filesToUpload.slice(3);
  } else {
    sliceFiles = [...filesToUpload];
    filesToUpload = [];
  }

  sliceFiles.forEach((file) => {
    uploadFiles(file);
  });
}

function submitStatus(boolean) {
  fileSubmit.disabled = boolean;
  fileSubmit.classList.toggle("upload-btn--opacity", boolean);
}

function openModal(text, color) {
  modalText.innerText = text;
  modal.style.display = "block";
  modalText.style.color = color;
}

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

fileInput.addEventListener("change", () => {
  filesToUpload = [...filesToUpload, ...Array.from(fileInput.files)];
  fileCount.innerText = filesToUpload.length;

  if (filesToUpload.length > 0) {
    submitStatus(false);
  }
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("upload-area--gray");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("upload-area--gray");
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();

  filesToUpload = [...filesToUpload, ...Array.from(event.dataTransfer.files)];

  fileCount.innerText = filesToUpload.length;
  dropArea.classList.remove("upload-area--gray");

  if (filesToUpload.length > 0) {
    submitStatus(false);
  }
});

fileReset.addEventListener("click", resetFile);
fileSubmit.addEventListener("click", submitFiles);
