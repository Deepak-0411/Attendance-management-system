import { useEffect, useState } from "react";
import Header from "./Header";
import Table from "./Table";
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
      apiGet: `https://gbu-server.vercel.app/api/admin/duty?from=${fromDate}&to=${toDate}`,
      apiDelete: "https://gbu-server.vercel.app/api/admin/duty",
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
  }, [token, refreshTrigger]);

  const handleSearch = (e) =>
    setSearchTerm(e.target.value.toLowerCase().trim());

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${type} with id=${id} ?`
      )
    )
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
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  return (
    <div className={`${styles.container}`} id="container">
      {/* This is header  */}
      <Header
        title={title}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        setShow={() => setShow(true)}
        addText={addText}
      />

      {/* Date input from-to only appear if type == examduty */}
      {type === "ExamDuty" ? (
        <div className={`${styles.filterContainer} `} id="filterContainer">
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
            <button
              className={styles.searchButton}
              onClick={() => setRefreshTrigger((prev) => !prev)}
              disabled={!(fromDate && toDate)}
            >
              Search
            </button>
          </div>
          <button className={styles.exportBtn}>
            <span className={styles.exportBtnText}>EXPORT</span>
            <span className={styles.exportBtnSvg}>
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
        <Table
          tableHeading={tableHeading}
          filteredData={filteredData}
          idKey={idKey}
          tableData={tableData}
          isDeleting={isDeleting}
          deleteData={() => handleDelete(item[idKey])}
        />
      )}
    </div>
  );
};

export default DisplayData;
