import { Dropzone } from "dropzone";

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

Dropzone.options.imagen = {
  dictDefaultMessage: "Suelta tus archivos aquí",
  acceptedFiles: ".jpg,.png,.jpeg",
  maxFileSize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: "Eliminar archivo",
  dictMaxFilesExceeded: "Solo se puede subir un archivo",
  headers: {
    "CSRF-Token": token,
  },
  paramName: "imagen",
  init: function () {
    const dropzone = this;
    const btnPublicar = document.querySelector("#publicar");

    btnPublicar.addEventListener("click", function () {
      dropzone.processQueue();
    });
    dropzone.on("queuecomplete", function (file, mensaje) {
      if (dropzone.getActiveFiles().length === 0) {
        window.location.href = "/mis-propiedades";
      }
    });
  },
};
