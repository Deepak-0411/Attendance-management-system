import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FilterBar from "../Filterbar/FilterBar";
import {date} from "../../utility/GetDate";
import styles from "./DownloadFile.module.css";


const Downloadfile = ({ close, type, filterOptions }) => {

  const { token } = useAuth();
  const [loading, setLoading] = useState(false);


  // apiEndPoint: `https://gbu-server.vercel.app/api/admin/duty/export`,
  // apiEndPoint: `https://gbu-server.vercel.app/api/admin/attandance/export`,

  
  const handleDownload = async () => {
    setLoading(true);
    try {
      const roomSplit = room.split("-");

      const apiURL = new URL(apiEndPoint);
      apiURL.searchParams.append("fromdate", fromDate);
      apiURL.searchParams.append("todate", toDate);
      {
        type === "Attendance" &&
          apiURL.searchParams.append("buildingName", roomSplit[0]);
        apiURL.searchParams.append("roomNo", roomSplit[1]);
        apiURL.searchParams.append("shift", shift);
      }
      const response = await fetch(apiURL, {
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
      <FilterBar filters={[]} maxDate={0} showSearchBtn={false} />
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`${styles.downloadBtn} ${loading ? styles.downloading : ""}`}
      >
        {loading ? "Downloading..." : "Download Excel"}
      </button>
    </div>
  );
};

export default Downloadfile;
