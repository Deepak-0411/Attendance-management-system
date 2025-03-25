import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "../Components/DisplayData.module.css";
import SingleUpload from "../Components/SingleUplaod";
import setHeight from "../../SetHeight";

const Attendance = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const { tableHeight } = setHeight();

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
      tableHeading: ["Date","Shift","Building Name", "Room No.", "Roll No.","Course Code" ,"Booklet No.","Status","Marked By"],
      tableData: ["date","shift","buildingName", "roomNo", "rollNo","courseCode" ,"bookletNumber","status","signature"],
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
        const roomSplit =room.split("-");
        
        const url = new URL(apiGet);
        url.searchParams.append("buildingName", roomSplit[0]);
        url.searchParams.append("roomNo", roomSplit[1]);
        url.searchParams.append("shift", shift);
        url.searchParams.append("from", fromDate);
        url.searchParams.append("to", toDate);
        

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch student data");
        const data=await response.json();
        setDataList(data.entries);
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
    <div className={`${styles.container} container`} >
      <div className={`${styles.header} header`}>
        <p className={styles.title}>{title}</p>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={() => setShow(true)}>
            {addText}
          </button>
        </div>
      </div>

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
              {Array.isArray(filterOptions[filter+"s"])
                ? filterOptions[filter+"s"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                : null}
            </select>
          ))}
 
          <button
            className={styles.searchButton}
            onClick={() => {setLoadData(true); setRefresh((prev) => !prev);}}
            disabled={!(room && shift && fromDate && toDate)}
          >
            Search
          </button>
        </div>
        <button>Export data</button>
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
          <div className={styles.tableBox} style={{ height: tableHeight}}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th
                    className={`${styles.tableHeading} ${styles.tableLayout1}`}
                  >
                    SR No.
                  </th>
                  {tableHeading.map((heading, index) => (
                    <th
                      key={heading + index}
                      className={`${styles.tableHeading} ${index===tableHeading.length-1? styles.tableLayout3 : ""}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item[idKey]+index}>
                      <td>{index + 1}</td>
                      {tableData.map((row) => (
                        <td key={row + index}>{item[row]} </td>
                      ))}
                      {/* <td className={styles.tableDataLayout4}>
                        <button
                          disabled={isDeleting}
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item[idKey])}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <rect
                              width="24"
                              height="24"
                              rx="3"
                              fill={isDeleting ? "#919191" : "#F04343"}
                            />
                            <path
                              d="M7.71429 17.5556C7.71429 18.35 8.35714 19 9.14286 19H14.8571C15.6429 19 16.2857 18.35 16.2857 17.5556V8.88889H7.71429V17.5556ZM17 6.72222H14.5L13.7857 6H10.2143L9.5 6.72222H7V8.16667H17V6.72222Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2 + tableHeading.length}
                      className={styles.noData}
                    >
                      No student found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default Attendance;
