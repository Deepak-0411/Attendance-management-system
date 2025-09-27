import { useState } from "react";
import styles from "./SingleUpload.module.css";
import UploadExcel from "../UploadExcel/UploadExcel";
import { toast } from "react-toastify";
import { apiRequest } from "../../utility/apiRequest";
import Input from "../Input/Input";
import Overlay from "../Overlay/Overlay";

const SingleUpload = ({
  dataToSend = {},
  apiEndPointSingle,
  apiEndPointBulk,
  parent
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [data, setData] = useState(
    Object.fromEntries(
      Object.entries(dataToSend).map(([key, obj]) => [key, obj.value])
    )
  );

  const handleChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiRequest({
      url: apiEndPointSingle,
      method: "POST",
      body: data,
      setLoading: setIsUploading,
      onSuccess: (response) => {
        toast.success(`Added successfully! ${response.data.message}`);
      },
      onFailure: (response) => {
        console.error("Error:", response.message);
        toast.error(
          `Upload failed: ${
            response.message || response.data.error || "Unknown error"
          }`
        );
      },
    });
  };

  return (
    <div className={styles.container}>
      {showBulkUpload && (
        <Overlay onClose={() => setShowBulkUpload(false)}>
          <UploadExcel apiEndPoint={apiEndPointBulk} parent={parent} />
        </Overlay>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.keys(dataToSend).map((key) => {
          const field = dataToSend[key];

          return (
            <div key={key}>
              <Input
                type={3}
                role={field.role}
                name={key}
                placeholder={field.placeholder}
                required={true}
                options={
                  field.role === "select" && field.options
                    ? field.options(data)
                    : []
                }
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
