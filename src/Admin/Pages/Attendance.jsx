import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "../Components/CSS/DisplayData.module.css";
import SingleUpload from "../Components/SingleUplaod";
import Header from "../Components/Header";
import Table from "../Components/Table";
import DownloadFile from "../Components/DownloadFile";
import FilterBar from "../Components/FilterBar";
import date from "../../Utility/GetDate";

const Attendance = () => {

  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

  // Filter states
  const [filters, setFilters] = useState({
    room: "",
    shift: "",
  });
  const { room, shift } = filters;

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    rooms: ["Loading..."],
    shifts: ["Loading..."],
  });

  const { token } = useAuth();

  const config = {
    Attendance: {
      title: "Attendance",
      apiGet: "https://gbu-server.vercel.app/api/admin/viewEntries",
      apiFilter: "https://gbu-server.vercel.app/api/admin/formFilterData",
      apiDelete: "https://gbu-server.vercel.app/api/admin/students",
      idKey: "rollNo",
      nameKey: "courseCode",
      addText: "+ Add Student",
      formFields: {
        buildingName: { value: "", placeholder: "Building Name" },
        roomNo: { value: "", placeholder: "Room No." },
        shift: { value: "", placeholder: "Shift" },
        rollNo: { value: "", placeholder: "Roll No." },
        courseCode: { value: "", placeholder: "Course Code" },
        date: { value: "", placeholder: "Date" },
      },
      tableHeading: [
        "Date",
        "Shift",
        "Building Name",
        "Room No.",
        "Roll No.",
        "Course Code",
        "Booklet No.",
        "Status",
        "Marked By",
      ],
      tableData: [
        "date",
        "shift",
        "buildingName",
        "roomNo",
        "rollNo",
        "courseCode",
        "bookletNumber",
        "status",
        "signature",
      ],
      apiEndPointSingle: "addStudent",
      apiEndPointBulk: "importExcel",
    },
  };

  const {
    title,
    apiGet,
    apiDelete,
    apiFilter,
    idKey,
    nameKey,
    addText,
    formFields,
    tableHeading,
    tableData,
    apiEndPointSingle,
    apiEndPointBulk,
  } = config["Attendance"];

  // Fetch filter options (Year, Programme, Branch)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(apiFilter, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch filter options");

        const data = await response.json();

        setFilterOptions({
          rooms: data.rooms || [],
          shifts: data.shifts || [],
        });
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to load filter options.");
      }
    };

    fetchOptions();
  }, [token, refresh]);

  // Fetch students based on filters
  useEffect(() => {
    const fetchData = async () => {
      if (!(room && shift && loadData && fromDate && toDate)) return;

      setLoading(true);
      setError(null);

      try {
        const roomSplit = room.split("-");

        const url = new URL(apiGet);
        url.searchParams.append("buildingName", roomSplit[0]);
        url.searchParams.append("roomNo", roomSplit[1]);
        url.searchParams.append("shift", shift);
        url.searchParams.append("fromdate", fromDate);
        url.searchParams.append("todate", toDate);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch student data");
        const data = await response.json();

        setDataList(data.formattedEntries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    setIsDeleting(true);
    try {
      const response = await fetch(apiDelete, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [idKey]: id }),
      });

      if (!response.ok) throw new Error("Failed to delete student.");

      setDataList((prev) => prev.filter((item) => item[idKey] !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = dataList.filter((item) => {
    const name = item[nameKey]?.toLowerCase() || "";
    const id = item[idKey]?.toString().toLowerCase() || "";

    return name.includes(searchTerm) || id.includes(searchTerm);
  });


  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleFromDateChange = (value) => {
    setFromDate(value);

    const maxSelectableToDate = addDays(value, 30);
    if (toDate < value || toDate > maxSelectableToDate) {
      setToDate(value);
    }
  };

  const handleToDateChange = (value) => {
    if (value >= fromDate && value <= addDays(fromDate, 30)) {
      setToDate(value);
    }
  };

  const handleFilterChange = (value, name) => {
    if (value !== "Loading...") {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filterInputs = [
    {
      type: "date",
      label: "From",
      name: "from",
      value: fromDate,
      onChange: (val) => handleFromDateChange(val),
      required: true,
    },
    {
      type: "date",
      label: "To",
      name: "to",
      value: toDate,
      onChange: (val) => handleToDateChange(val),
      required: true,
    },
    {
      type: "select",
      label: "Room",
      name: "room",
      value: room,
      options: filterOptions.rooms,
      onChange: (val, name) => handleFilterChange(val, name),
      required: true,
    },
    {
      type: "select",
      label: "Shift",
      name: "shift",
      value: shift,
      options: filterOptions.shifts,
      onChange: (val, name) => handleFilterChange(val, name),
      required: true,
    },
  ];
  return (
    <div className={`${styles.container} `} id="container">
      <Header
        title={title}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        setShowUpload={() => setShowUpload(true)}
        addText={addText}
      />

      <FilterBar
        filters={filterInputs}
        searchBtnAction={() => {
          setLoadData(true);
          setRefresh((prev) => !prev);
        }}
        showExportBtn={true}
        exportBtnAction={setShowExport}
      />

      {showUpload && (
        <div className={styles.showOverlay}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShowUpload(false);
              setRefresh((prev) => !prev);
            }}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
          />
        </div>
      )}
      {showExport && (
        <div className={styles.showOverlay}>
          <DownloadFile
            close={() => setShowExport(false)}
            filterOptions={{"rooms" : filterOptions.rooms , "shifts" : filterOptions.shifts}}
            type={"Attendance"}
          />
        </div>
      )}

      {loadData &&
        (loading ? (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <Table
            tableHeading={tableHeading}
            filteredData={filteredData}
            idKey={idKey}
            tableData={tableData}
            isDeleting={isDeleting}
            deleteData={() => handleDelete(item[idKey])}
          />
        ))}
    </div>
  );
};

export default Attendance;
