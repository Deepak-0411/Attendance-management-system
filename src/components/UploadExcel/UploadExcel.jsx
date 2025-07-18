import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./UploadExcel.module.css";
import { toast } from "react-toastify";
import apiRequest from "../../utility/apiRequest";

const UploadExcel = ({ closebulk, apiEndPoint }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.info("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiRequest({
      url: `/admin/${apiEndPoint}`,
      method: "POST",
      body: formData,
      bodyStringify: false,
      token: token,
      setLoading: setIsUploading,
    });

    if (response.status === "success") {
      toast.success(`File uploaded successfully! ${response.message}`);
    } else if (response.data?.error) {
      console.error("Error:", response.data.error);
      toast.error(`Upload failed: ${response.data.error || "Unknown error"}`, {
        autoClose: 5000,
      });
    } else {
      console.error("Error:", response.message);
      toast.error(`Upload failed: ${response.message || "Unknown error"}`);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        id="aqc2113"
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
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadExcel;
