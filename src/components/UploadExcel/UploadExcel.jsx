// import { useState } from "react";
// import styles from "./UploadExcel.module.css";
// import { toast } from "react-toastify";
// import { apiRequest } from "../../utility/apiRequest";
// import Overlay from "../Overlay/Overlay";
// import SkippedData from "../SkippedData/SkippedData";

// const UploadExcel = ({ apiEndPoint }) => {
//   const [file, setFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [showUploadInfo, setShowUploadInfo] = useState(false);
//   const [data, setData] = useState([]);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Allowed extensions
//     const allowedExtensions = [".xlsx", ".xls", ".csv", ".ods"];

//     // Allowed MIME types
//     const allowedTypes = [
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
//       "application/vnd.ms-excel", // .xls
//       "text/csv", // .csv
//       "application/vnd.oasis.opendocument.spreadsheet", // .ods
//     ];

//     // Check extension
//     const fileExtension = file.name
//       .substring(file.name.lastIndexOf("."))
//       .toLowerCase();
//     const isValidExtension = allowedExtensions.includes(fileExtension);

//     // Check MIME type (depends on browser, so double-check with extension)
//     const isValidType = allowedTypes.includes(file.type);

//     if (!isValidExtension || !isValidType) {
//       toast.info("Only Excel (.xlsx, .xls), CSV, or ODS files are allowed!");
//       event.target.value = "";
//       return;
//     }

//     setFile(file);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       toast.info("Please select a file first!");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);

//     await apiRequest({
//       url: apiEndPoint,
//       method: "POST",
//       body: formData,
//       bodyStringify: false,
//       setLoading: setIsUploading,
//       onSuccess: (response) => {
//         toast.success(`File uploaded successfully! ${response.message}`);

//         if (response.data?.skipped > 0) {
//           setData(response.data);
//           setShowUploadInfo(true);
//         }
//       },

//       onFailure: (response) => {
//         console.error("Error:", response.message || response.data?.error);

//         toast.error(
//           `Upload failed: ${
//             response.message || response.data?.error || "Unknown error"
//           }`,
//           { autoClose: 5000 }
//         );
//       },
//     });
//   };

//   return (
//     <div className={styles.uploadContainer}>
//       <input
//         id="aqc2113"
//         className={styles.uploadContainerInput}
//         type="file"
//         accept=".xlsx, .xls, .csv, .ods"
//         onChange={handleFileChange}
//         disabled={isUploading}
//       />

//       <button
//         className={styles.uploadContainerBtn}
//         onClick={handleUpload}
//         disabled={isUploading}
//       >
//         {isUploading ? "Uploading..." : "Upload"}
//       </button>

//       {showUploadInfo && (
//         <Overlay onClose={() => setShowUploadInfo(false)}>
//           <SkippedData data={data} />
//         </Overlay>
//       )}
//     </div>
//   );
// };

// export default UploadExcel;

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./UploadExcel.module.css";
import { toast } from "react-toastify";
import { apiRequest } from "../../utility/apiRequest";
import { useData } from "../../context/DataContext";

const UploadExcel = ({ apiEndPoint, title }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showSkippedData } = useData();

  const validateFile = (file) => {
    const allowedExtensions = [".xlsx", ".xls", ".csv", ".ods"];
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
      "application/vnd.oasis.opendocument.spreadsheet", // .ods
    ];

    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    const isValidExtension = allowedExtensions.includes(fileExtension);
    const isValidType = allowedTypes.includes(file.type);

    if (!isValidExtension || !isValidType) {
      toast.info("Only Excel (.xlsx, .xls), CSV, or ODS files are allowed!");
      return false;
    }
    return true;
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
      "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
    },
  });

  // const handleUpload = async () => {
  //   if (!file) {
  //     toast.info("Please select a file first!");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   await apiRequest({
  //     url: apiEndPoint,
  //     method: "POST",
  //     body: formData,
  //     bodyStringify: false,
  //     setLoading: setIsUploading,
  //     onSuccess: (response) => {
  //       toast.success(`File uploaded successfully! ${response.message}`);

  //       if (response.data?.skipped > 0) {
  //         showSkippedData(response.data,title);
  //       }
  //     },
  //     onFailure: (response) => {
  //       console.error("Error:", response.message || response.data?.error);
  //       toast.error(
  //         `Upload failed: ${
  //           response.message || response.data?.error || "Unknown error"
  //         }`,
  //         { autoClose: 5000 }
  //       );
  //     },
  //   });
  // };
  const handleUpload = async () => {
    if (!file) {
      toast.info("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const uploadPromise = new Promise(async (resolve, reject) => {
      apiRequest({
        url: apiEndPoint,
        method: "POST",
        body: formData,
        bodyStringify: false,
        setLoading: setIsUploading,
        onSuccess: (response) => {
          if (response.data?.skipped > 0) {
            try {
              showSkippedData(response.data, title);
            } catch (err) {
              return reject(err);
            }
          }
          resolve(response);
        },
        onFailure: (response) => {
          const errorMsg =
            response.message || response.data?.error || "Unknown error";
          reject(new Error(errorMsg));
        },
      });
    });

    toast.promise(uploadPromise, {
      pending: {
        render: "Uploading file...",
        type: "info",
        autoClose: false,
        // position: "bottom-right",
      },
      success: {
        render: "File uploaded successfully!",
        type: "success",
        autoClose: 5000,
        // position: "top-right",
      },
      error: {
        render({ data }) {
          return `Upload failed: ${data.message}`;
        },
        type: "error",
        autoClose: 5000,
        // position: "top-right",
      },
    });
  };

  return (
    <div className={styles.uploadContainer}>
      {/* Dropzone UI */}
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} disabled={isUploading} />
        {file ? (
          <p className=" flex items-center justify-center gap-2">
            {excelSvg} {file.name}
          </p>
        ) : isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
      </div>

      {/* Upload button */}
      <button
        className={styles.uploadContainerBtn}
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadExcel;

const excelSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="28px"
    height="28px"
  >
    <path
      fill="#169154"
      d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"
    />
    <path
      fill="#18482a"
      d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"
    />
    <path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z" />
    <path fill="#17472a" d="M14 24.005H29V33.055H14z" />
    <g>
      <path
        fill="#29c27f"
        d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"
      />
      <path
        fill="#27663f"
        d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"
      />
      <path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z" />
      <path fill="#129652" d="M29 24.005H44V33.055H29z" />
    </g>
    <path
      fill="#0c7238"
      d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
    />
    <path
      fill="#fff"
      d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"
    />
  </svg>
);
