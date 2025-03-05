import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import styles from "./UploadExcel.module.css";

const UploadExcel = ({ closebulk ,apiEndPoint}) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setIsUploading(true); 

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://gbu-server.vercel.app/api/admin/${apiEndPoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(`File uploaded successfully! ${result.message}`);
      } else {
        alert(`Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <button className={styles.closeBtn} disabled ={isUploading} onClick={closebulk}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e3e3e3"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
      <input
        className={styles.uploadContainerInput}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        disabled={isUploading} 
      />
      <button
        className={styles.uploadContainerBtn}
        onClick={handleUpload}
        disabled={isUploading} 
      >
        {isUploading ? "Uploading..." : "Upload"} {/*  Dynamic Button Text */}
      </button>
    </div>
  );
};

export default UploadExcel;
