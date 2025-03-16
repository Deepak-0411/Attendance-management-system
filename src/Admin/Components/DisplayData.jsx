import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import styles from "./DisplayData.module.css";
import SingleUpload from "./SingleUplaod";

const DisplayData = ({ type }) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedDate);

  const { token } = useAuth();

  const config = {
    course: {
      title: "Courses",
      apiGet: "https://gbu-server.vercel.app/api/admin/courses",
      apiDelete: "https://gbu-server.vercel.app/api/admin/courses",
      idKey: "courseCode",
      nameKey: "courseName",
      addText: "+ Add Course",
      formFields: {
        courseName: { value: "", placeholder: "Course Name" },
        courseCode: { value: "", placeholder: "Course Code" },
      },
      tableHeading: ["Course Name", "Course Code"],
      tableData: ["courseName", "courseCode"],
      apiEndPointSingle: "courses",
      apiEndPointBulk: "importCourses",
    },
    faculty: {
      title: "Faculty Available",
      apiGet: "https://gbu-server.vercel.app/api/admin/faculty",
      apiDelete: "https://gbu-server.vercel.app/api/admin/faculty",
      idKey: "teacherId",
      nameKey: "fName",
      addText: "+ Add Faculty",
      formFields: {
        fName: { value: "", placeholder: "Name" },
        teacherId: { value: "", placeholder: "Teacher ID" },
        username: { value: "", placeholder: "Username" },
        password: { value: "", placeholder: "Password" },
        schoolName: { value: "", placeholder: "School Name" },
      },
      tableHeading: ["Faculty Name", "Faculty-ID", "School Name"],
      tableData: ["fName", "teacherId", "schoolName"],
      apiEndPointSingle: "faculty",
      apiEndPointBulk: "faculty/import",
    },
    room: {
      title: "Rooms Available",
      apiGet: "https://gbu-server.vercel.app/api/admin/examRooms",
      apiDelete: "https://gbu-server.vercel.app/api/admin/faculty",
      idKey: "roomNo",
      nameKey: "buildingName",
      addText: "+ Add Room",
      formFields: {
        buildingName: { value: "", placeholder: "Building Name" },
        roomNo: { value: "", placeholder: "Room No." },
        capacity: { value: "", placeholder: "Capacity" },
      },
      tableHeading: ["Building Name", "Room No", "Capacity"],
      tableData: ["buildingName", "roomNo", "capacity"],
      apiEndPointSingle: "faculty",
      apiEndPointBulk: "roomImport",
    },
    ExamDuty: {
      title: "Exam Duty",
      apiGet: "https://gbu-server.vercel.app/api/admin/duty",
      apiDelete: "https://gbu-server.vercel.app/api/admin/faculty",
      idKey: "teacherId",
      nameKey: "fName",
      addText: "+ Assign Duty",
      formFields: {
        teacherId: { value: "", placeholder: "Faculty-ID" },
        buildingName: { value: "", placeholder: "Building Name" },
        roomNo: { value: "", placeholder: "Room no." },
        shift: { value: "", placeholder: "Shift" },
        Date: { value: "", placeholder: "Date" },
      },
      tableHeading: [
        "Faculty Name",
        "Faculty-ID",
        "Building Name",
        "Room No.",
        "Shift",
        "Date",
      ],
      tableData: [
        "fName",
        "teacherId",
        "buildingName",
        "roomNo",
        "shift",
        "Date",
      ],
      apiEndPointSingle: "duty",
      apiEndPointBulk: "duty/import",
    },
  };

  const {
    title,
    apiGet,
    apiDelete,
    idKey,
    nameKey,
    addText,
    formFields,
    tableHeading,
    tableData,
    apiEndPointSingle,
    apiEndPointBulk,
  } = config[type];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiGet, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(
            `Error ${response.status}: Failed to fetch ${type} data`
          );
        const data = await response.json();
        
        setDataList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiGet, token, refreshTrigger]);

  const handleSearch = (e) =>
    setSearchTerm(e.target.value.toLowerCase().trim());

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
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

      if (!response.ok) throw new Error(`Failed to delete ${type}.`);

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
    const room =
      type === "room" || type === "ExamDuty"
        ? (item["buildingName"]?.toLowerCase() || "") +
          (item["roomNo"]?.toString().toLowerCase() || "")
        : "";

    return (
      name.includes(searchTerm) ||
      id.includes(searchTerm) ||
      room.includes(searchTerm)
    );
  });

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    setFromDate(value);

    if (toDate < value) {
      setToDate(value);
    }
    setRefreshTrigger((prev) => !prev);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {/* This is header  */}
      <div className={styles.header}>
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

      {/* Date input from-to only appear if type == examduty */}
      {type === "ExamDuty" ? (
        <div className={styles.filterContainer}>
          <div className={styles.containerInside}>
          <p>From -</p>
          <input
            type="date"
            className={styles.filterInput}
            value={fromDate}
            onChange={handleFromDateChange}
          />
          <p></p>
          <p> To -</p>
          <input
            type="date"
            className={styles.filterInput}
            min={fromDate}
            value={toDate}
            onChange={handleToDateChange}
          />
          </div>
          <button>Export data</button>
        </div>
      ) : (
        ""
      )}

      {/* file upload */}
      {show && (
        <div className={styles.uploadData}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShow(false);
              setRefreshTrigger((prev) => !prev);
            }}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
          />
        </div>
      )}

      {/* loading spinner  and table*/}
      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div
          id={type === "ExamDuty" ? styles.tableBoxAddon : ""}
          className={styles.tableBox}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.tableHeading} ${styles.tableLayout1}`}>
                  SR No.
                </th>
                {tableHeading.map((heading, index) => (
                  <th
                    key={heading + index}
                    className={`${styles.tableHeading} `}
                  >
                    {heading}
                  </th>
                ))}
                <th
                  className={`${styles.tableHeading} ${styles.tableLayout3}`}
                ></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item[idKey] + index}>
                    <td>{index + 1}</td>
                    {tableData.map((row) => (
                      <td key={row + index}>{item[row]}</td>
                    ))}
                    <td className={styles.tableDataLayout4}>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2 + tableHeading.length}
                    className={styles.noData}
                  >
                    No {type} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayData;
