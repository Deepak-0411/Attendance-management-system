import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import FilterBar from "./FilterBar";
import date from "../../Utility/GetDate";
import styles from "./CSS/DownloadFile.module.css";


const Downloadfile = ({ close, type, filterOptions }) => {

  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: date,
    toDate: date,
    room: "",
    shift: "",
  });

  const { fromDate, toDate, room, shift } = filters;

  const config = {
    ExamDuty: {
      filterInputs: [
        {
          type: "date",
          label: "From",
          name: "fromDate",
          value: fromDate,
          onChange: (val) => handleFromDateChange(val),
          required: true,
        },
        {
          type: "date",
          label: "To",
          name: "toDate",
          value: toDate,
          onChange: (val) => handleToDateChange(val),
          required: true,
        },
      ],
      apiEndPoint: `https://gbu-server.vercel.app/api/admin/duty/export`,
    },
    Attendance: {
      filterInputs: [
        {
          type: "date",
          label: "From",
          name: "fromDate",
          value: fromDate,
          onChange: (val) => handleFromDateChange(val),
          required: true,
        },
        {
          type: "date",
          label: "To",
          name: "toDate",
          value: toDate,
          onChange: (val) => handleToDateChange(val),
          required: true,
        },
        {
          type: "select",
          label: "Room",
          name: "room",
          value: room,
          options: filterOptions?.rooms,
          onChange: (val, name) => handleFilterChange(val, name),
          required: true,
        },
        {
          type: "select",
          label: "Shift",
          name: "shift",
          value: shift,
          options: filterOptions?.shifts,
          onChange: (val, name) => handleFilterChange(val, name),
          required: true,
        },
      ],
      apiEndPoint: `https://gbu-server.vercel.app/api/admin/attandance/export`,
    },
  };

  const {filterInputs,apiEndPoint}= config[type];
  
  const handleFromDateChange = (value) => {
    setFilters((prev) => ({ ...prev, ["fromDate"]: value }));

    if (toDate < value ) {
        setFilters((prev) => ({ ...prev, ["toDate"]: value }));
    }
  };

  const handleToDateChange = (value) => {
    if (value >= fromDate ) {
        setFilters((prev) => ({ ...prev, ["toDate"]: value }));
    }
  };

  const handleFilterChange = (value, name) => {
    if (value !== "Loading...") {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

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

      // Try to get filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let fileName = "report.xlsx";

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
      }

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
      <FilterBar filters={filterInputs} showSearchBtn={false} />
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`${styles.downloadBtn} ${loading ? styles.downloading : ""}`}
      >
        {loading ? "Downloading..." : "Download Excel"}
      </button>

      <button onClick={close} className={styles.closeBtn}>
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
    </div>
  );
};

export default Downloadfile;
