import { useState } from "react";
import FilterBar from "../Filterbar/FilterBar";
import styles from "./DownloadFile.module.css";
import { baseURL } from "../../utility/apiRequest";
import { toast } from "react-toastify";

const Downloadfile = ({
  exportFilters = [],
  apiEndPoint,
  exportFileName = "",
  dateFilter = true,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseURL + apiEndPoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();

      let fileName = exportFileName || "report.xlsx";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(
        `Error downloading Excel file : ${error.message || error.error}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <FilterBar
        dateFilter={dateFilter}
        filters={exportFilters}
        maxDate={0}
        showSearchBtn={false}
        showDownloadBtn={true}
        downloadBtnAction={handleDownload}
        isBtnDissabled={loading}
      />
      {/* <button
        onClick={handleDownload}
        disabled={loading}
        className={`${styles.downloadBtn} ${loading ? styles.downloading : ""}`}
      >
        {loading ? "Downloading..." : "Download Excel"}
      </button> */}
    </div>
  );
};

export default Downloadfile;
