const uploadArea = document.querySelector(".upload-area");
const fileCount = document.querySelector(".upload-area__count");
fileCount.innerText = 0;
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

function uploadFiles(files) {
  let countUploads = 0;

  files.forEach((file) => {
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

    const formData = new FormData();
    formData.append("file", file);

    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", URL + "/upload", true);

      xhr.addEventListener("load", () => {
        if (xhr.status !== 200) {
          reject();
        }

        resolve();
      });

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;

          progressBarFill.style.width = percentComplete + "%";
          percent.innerText = percentComplete.toFixed() + "%";

          if (percentComplete === 100) {
            countUploads += 1;
            if (countUploads === files.length) {
              fileCount.innerText = filesToUpload.length;
              submitFiles();
            }
          }
        }
      });

      xhr.addEventListener("error", () => reject(xhr.statusText));

      xhr.send(formData);
    })
      .then(() => {
        progressBarFill.classList.add("list-item__progress--green");
      })
      .catch(() => {
        progressBarFill.classList.add("list-item__progress--red");
      });
  });
}

function resetFile() {
  filesToUpload = [];
  sliceFiles = [];
  fileCount.innerText = 0;
  fileList.innerHTML = "";

  uploadArea.classList.remove("upload-area--red");

  btnDisabled(fileSubmit, true);
  btnDisabled(fileReset, true);
}

function submitFiles(isClicked) {
  if (isClicked) {
    btnDisabled(fileSubmit, true);
    btnDisabled(fileReset, true);
    uploadArea.classList.add("upload-area--red");
  }

  if (filesToUpload.length === 0) {
    btnDisabled(fileReset, false);
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

function btnDisabled(btn, boolean) {
  btn.disabled = boolean;
  btn.classList.toggle("upload-btn--disabled", boolean);
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
    btnDisabled(fileSubmit, false);
    btnDisabled(fileReset, false);
  }
});

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("upload-area--gray");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("upload-area--gray");
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();

  uploadArea.classList.remove("upload-area--gray");

  filesToUpload = [...filesToUpload, ...Array.from(event.dataTransfer.files)];

  fileCount.innerText = filesToUpload.length;

  if (filesToUpload.length > 0) {
    btnDisabled(fileSubmit, false);
    btnDisabled(fileReset, false);
  }
});

fileReset.addEventListener("click", resetFile);
fileSubmit.addEventListener("click", () => submitFiles(true));
