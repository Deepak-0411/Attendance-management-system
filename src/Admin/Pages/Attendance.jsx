import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "../Components/DisplayData.module.css";
import SingleUpload from "../Components/SingleUplaod";
import Header from "../Components/Header";
import Table from "../Components/Table";

const Attendance = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedDate);

  // Filter states
  const [filters, setFilters] = useState({
    room: "",
    shift: "",
  });
  const { room, shift } = filters;

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    rooms: [],
    shifts: [],
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
        Date: { value: "", placeholder: "Date" },
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
        url.searchParams.append("fromdate",fromDate);
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

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    setFromDate(value);

    if (toDate < value) {
      setToDate(value);
    }
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  return (
    <div className={`${styles.container} container`}>
      <Header
        title={title}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        setShow={() => setShow(true)}
        addText={addText}
      />

      {/* Filters */}
      <div className={`${styles.filterContainer} filterContainer`}>
        <div className={styles.containerInside}>
          <p>From -</p>
          <input
            type="date"
            className={styles.filterInput}
            value={fromDate}
            onChange={handleFromDateChange}
          />
          <p> To -</p>
          <input
            type="date"
            className={styles.filterInput}
            min={fromDate}
            value={toDate}
            onChange={handleToDateChange}
          />

          {["room", "shift"].map((filter) => (
            <select
              key={filter}
              className={styles.filterInput}
              value={filters[filter]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [filter]: e.target.value }))
              }
            >
              <option value="">{`Select ${
                filter.charAt(0).toUpperCase() + filter.slice(1)
              }`}</option>
              {Array.isArray(filterOptions[filter + "s"])
                ? filterOptions[filter + "s"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                : null}
            </select>
          ))}

          <button
            className={styles.searchButton}
            onClick={() => {
              setLoadData(true);
              setRefresh((prev) => !prev);
            }}
            disabled={!(room && shift && fromDate && toDate)}
          >
            Search
          </button>
        </div>
        <button className={styles.exportBtn}>
          EXPORT
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M3.7873 16.7812L2.7373 15.7125L4.9498 13.5H3.2623V12H7.4998V16.2375H5.9998V14.5687L3.7873 16.7812ZM8.9998 16.5V15H13.4998V6.75H9.7498V3H4.4998V10.5H2.9998V3C2.9998 2.5875 3.1468 2.2345 3.4408 1.941C3.7348 1.6475 4.0878 1.5005 4.4998 1.5H10.4998L14.9998 6V15C14.9998 15.4125 14.8531 15.7657 14.5596 16.0597C14.2661 16.3538 13.9128 16.5005 13.4998 16.5H8.9998Z"
                fill="black"
              />
            </svg>
          </span>
        </button>
      </div>

      {show && (
        <div className={styles.uploadData}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShow(false);
              setRefresh((prev) => !prev);
            }}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
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
