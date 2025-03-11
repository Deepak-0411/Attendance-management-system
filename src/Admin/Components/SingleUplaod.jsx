import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "./SingleUpload.module.css";
import UploadExcel from "./UploadExcel";

const SingleUplaod = ({ dataToSend = {}, close, apiEndPointSingle, apiEndPointBulk }) => {
  const [data, setData] = useState(
    Object.fromEntries(Object.entries(dataToSend).map(([key, obj]) => [key, obj.value]))
  );
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const { token } = useAuth();

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const response = await fetch(`https://gbu-server.vercel.app/api/admin/${apiEndPointSingle}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Added successfully! ${result.message}`);
      } else {
        alert(`Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Failed to upload data.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {showBulkUpload && (
        <div className={styles.bulkuploadData}>
          <UploadExcel closebulk={() => setShowBulkUpload(false)} apiEndPoint={apiEndPointBulk} />
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.keys(dataToSend).map((key) => (
          <input
            key={key}
            required
            type={key === "password" ? "password" : key==="date" ? "date" : "text"}
            name={key}
            placeholder={dataToSend[key].placeholder}
            value={data[key] || ""}
            onChange={handleChange}
            className={styles.searchInput}
          />
        ))}

        <button type="submit" className={styles.uploadBtn} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <button
        type="button"
        className={styles.bulkUploadBtn}
        onClick={() => setShowBulkUpload(true)}
        disabled={isUploading}
      >
        Bulk Upload
      </button>

      <button
        className={styles.closeBtn}
        disabled={isUploading}
        style={showBulkUpload ? { display: "none" } : {}}
        onClick={close}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
    </div>
  );
};

export default SingleUplaod;
