import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./SingleUpload.module.css";
import UploadExcel from "../UploadExcel/UploadExcel";
import { toast } from "react-toastify";
import apiRequest from "../../utility/apiRequest";
import Input from "../Input/Input";
import Overlay from "../Overlay/Overlay";

const SingleUpload = ({
  dataToSend = {},
  apiEndPointSingle,
  apiEndPointBulk,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [data, setData] = useState(
    Object.fromEntries(
      Object.entries(dataToSend).map(([key, obj]) => [key, obj.value])
    )
  );

  const { token } = useAuth();

  const handleChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiRequest({
      url: apiEndPointSingle,
      method: "POST",
      body: data,
      token: token,
      setLoading: setIsUploading,
    });

    if (response.status === "success") {
      
      toast.success(`Added successfully! ${response.data.message}`);
    } else if (response.data?.error) {
      toast.error(`Upload failed: ${response.data.error || "Unknown error 11"}`, {
        autoClose: 5000,
      });
    } else {
      console.error("Error:", response.message);
      toast.error(`Upload failed: ${response.data || "Unknown error"}`);
    }
  };

  return (
    <div className={styles.container}>
      {showBulkUpload && (
        <Overlay onClose={() => setShowBulkUpload(false)}>
          <UploadExcel apiEndPoint={apiEndPointBulk} />
        </Overlay>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.keys(dataToSend).map((key) => {
          return (
            <div key={key}>
              <Input
                type={3}
                role={dataToSend[key].role}
                name={key}
                placeholder={dataToSend[key].placeholder}
                required={true}
                value={data[key] || ""}
                setValue={(value) => handleChange(key, value)}
              />
            </div>
          );
        })}

        <button
          type="submit"
          className={styles.uploadBtn}
          disabled={isUploading}
        >
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
    </div>
  );
};

export default SingleUpload;
