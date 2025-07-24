import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FilterBar from "../Filterbar/FilterBar";
import styles from "./DownloadFile.module.css";
import { baseURl } from "../../utility/apiRequest";

const Downloadfile = ({
  exportFilters = [],
  apiEndPoint,
  dateFilter = true,
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseURl + apiEndPoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();

      let fileName = "report.xlsx";

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
      alert("Error downloading Excel file");
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
