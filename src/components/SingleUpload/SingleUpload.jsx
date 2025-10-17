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
  title,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [data, setData] = useState(
    Object.fromEntries(
      Object.entries(dataToSend).map(([key, obj]) => [key, obj.value])
    )
  );

  const getName = () => {
    if (title.at(-1) == "s") return title.slice(0, -1);
    else return title;
  };

  const handleChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadPromise = new Promise((resolve, reject) => {
      apiRequest({
        url: apiEndPointSingle,
        method: "POST",
        body: data,
        setLoading: setIsUploading,
        onSuccess: (response) => {
          toast.success(`${response.data.message}`);
          resolve(response);
        },
        onFailure: (response) => {
          console.error("Error:", response.message);
          reject(response);
          toast.error(
            `Upload failed: ${
              response.message || response.data.error || "Unknown error"
            }`
          );
        },
      });
    });

    toast.promise(uploadPromise, {
      pending: {
        render: `Uploading ${getName()}...`,
        type: "info",
        autoClose: false,
      },
    });
  };

  return (
    <div className={styles.container}>
      {showBulkUpload && (
        <Overlay onClose={() => setShowBulkUpload(false)}>
          <UploadExcel apiEndPoint={apiEndPointBulk} title={title} />
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
