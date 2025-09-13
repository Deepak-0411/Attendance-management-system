import { useState } from "react";
import styles from "./UploadExcel.module.css";
import { toast } from "react-toastify";
import { apiRequest } from "../../utility/apiRequest";
import Overlay from "../Overlay/Overlay";
import SkippedData from "../SkippedData/SkippedData";

const UploadExcel = ({ apiEndPoint }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadInfo, setShowUploadInfo] = useState(false);
  const [data, setData] = useState([]);

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

    await apiRequest({
      url: apiEndPoint,
      method: "POST",
      body: formData,
      bodyStringify: false,
      setLoading: setIsUploading,
      onSuccess: (response) => {
        toast.success(`File uploaded successfully! ${response.message}`);

        if (response.data?.skipped > 0) {
          setData(response.data);
          setShowUploadInfo(true);
        }
      },

      onFailure: (response) => {
        console.error("Error:", response.message || response.data?.error);

        toast.error(
          `Upload failed: ${
            response.message || response.data?.error || "Unknown error"
          }`,
          { autoClose: 5000 }
        );
      },
    });
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

      {showUploadInfo && (
        <Overlay onClose={() => setShowUploadInfo(false)}>
          <SkippedData data={data} />
        </Overlay>
      )}
    </div>
  );
};

export default UploadExcel;
