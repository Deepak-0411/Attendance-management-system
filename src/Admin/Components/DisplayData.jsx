import { useEffect, useState } from "react";
import Header from "./Header";
import Table from "./Table";
import { useAuth } from "../../Auth/AuthContext";
import styles from "./CSS/DisplayData.module.css";
import SingleUpload from "./SingleUplaod";
import FilterBar from "./FilterBar";
import Downloadfile from "./DownloadFile";
import date from "../../Utility/GetDate";

const DisplayData = ({ type }) => {


  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

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
      apiGet: `https://gbu-server.vercel.app/api/admin/duty?fromdate=${fromDate}&todate=${toDate}`,
      apiDelete: "https://gbu-server.vercel.app/api/admin/duty",
      idKey: "teacherId",
      nameKey: "fName",
      addText: "+ Assign Duty",
      formFields: {
        teacherId: { value: "", placeholder: "Faculty-ID" },
        buildingName: { value: "", placeholder: "Building Name" },
        roomNo: { value: "", placeholder: "Room no." },
        shift: { value: "", placeholder: "Shift" },
        date: { value: "", placeholder: "Date" },
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
        "date",
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
  ];

  return (
    <div className={`${styles.container}`} id="container">
      {/* This is header  */}
      <Header
        title={title}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        setShowUpload={() => setShowUpload(true)}
        addText={addText}
      />

      {/* Date input from-to only appear if type == examduty */}
      {type === "ExamDuty" && (
        <FilterBar
          filters={filterInputs}
          searchBtnAction={() => setRefreshTrigger((prev) => !prev)}
          showExportBtn={true}
          exportBtnAction={setShowExport}
        />
      )}

      {/* file upload */}
      {showUpload && (
        <div className={styles.showOverlay}>
          <SingleUpload
            dataToSend={formFields}
            close={() => {
              setShowUpload(false);
              setRefreshTrigger((prev) => !prev);
            }}
            apiEndPointSingle={apiEndPointSingle}
            apiEndPointBulk={apiEndPointBulk}
          />
        </div>
      )}

      {showExport && (
        <div className={styles.showOverlay}>
          <Downloadfile
            close={() => setShowExport(false)}
            type={"ExamDuty"}
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
