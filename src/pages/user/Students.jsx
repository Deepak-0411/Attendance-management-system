import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import useTableHeight from "../../utility/setHeight";
import styles from "../../styles/modules/public/Students.module.css";
import Spinner from "../../components/Spinner/Spinner";
import { useData } from "../../context/DataContext";
import Input from "../../components/Input/Input";
import { toast } from "react-toastify";

const statuses = ["Present", "Absent", "UFM", "All"];

const Students = () => {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { tableHeight } = useTableHeight();
  const { token } = useAuth();
  const { studentlist, fetchStudents, facultyName } = useData();
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedShift = sessionStorage.getItem("shift");
  const selectedBuilding = sessionStorage.getItem("building");
  const selectedRoomNo = sessionStorage.getItem("room");
  const secondTeacher = state?.secondTeacher || "N/A";

  useEffect(() => {
    if (!(selectedShift && selectedBuilding && selectedRoomNo)) {
      toast.info("Please select a room and shift");
      navigate("/faculty/displayDuty");
      return;
    }

    fetchStudents(selectedShift, token, setLoading, setError);
  }, []);

  const filteredStudents = studentlist.filter((student) => {
    const statusMatch =
      activeStatus === "All" ||
      student.status?.toLowerCase() === activeStatus.toLowerCase();

    const query = search.toLowerCase();
    const searchMatch =
      student.name?.toLowerCase().includes(query) ||
      student.rollNo?.toLowerCase().includes(query);

    return statusMatch && searchMatch;
  });

  const handleClick = (index) => {
    sessionStorage.setItem("index", index);
    navigate(`/faculty/markAttendance`, {
      state: { studentlist: filteredStudents },
    });
  };

  const getStudentCount = (status) =>
    status === "All"
      ? studentlist.length
      : studentlist.filter(
          (s) => s.status?.toLowerCase() === status.toLowerCase()
        ).length;

  if (error)
    return (
      <ErrorBox
        error={error}
        onClick={() =>
          fetchStudents(selectedShift, token, setLoading, setError)
        }
      />
    );

  return (
    <div className={styles.parent}>
      {/* Header */}
      <div className={styles.roomInfo} id="header">
        <p className={styles.roomInfoP}>
          Room no: {selectedBuilding + " " + selectedRoomNo || "N/A"}
        </p>
        <p className={styles.roomInfoP}>
          Duty: {facultyName.fName} , {secondTeacher}
        </p>
        <p className={styles.roomInfoP}>Shift: {selectedShift || "N/A"}</p>
      </div>

      {/* Container */}
      <div className={styles.Studentlist} id="container">
        {/* Filter Buttons */}
        <div className={styles.filterBtns} id="filterContainer">
          {statuses.map((status) => (
            <div key={status}>
              <button
                onClick={() => setActiveStatus(status)}
                className={`${styles.filterBtn} ${
                  activeStatus === status ? styles[`filterBtn${status}`] : ""
                }`}
              >
                {getStudentCount(status)}
              </button>
              <p className={styles.filterBtnP}>{status}</p>
            </div>
          ))}
        </div>

        {/* Search Input */}
        <div className={styles.searchBox} id="searchBox">
          <Input
            type={4}
            role="text"
            placeholder="Search student by roll no. or name"
            value={search}
            setValue={setSearch}
          />
        </div>

        {/* Student List */}
        <div className={styles.contentBox} style={{ height: tableHeight }}>
          {loading ? (
            <Spinner color="white" fullPage size="large" />
          ) : filteredStudents.length ? (
            filteredStudents.map((student, index) => (
              <div
                key={student.rollNo}
                className={styles.content}
                onClick={() => handleClick(index)}
              >
                <div className={styles.contentData}>
                  <p className={styles.contentDataP}>
                    {student.rollNo || "N/A"}
                  </p>
                  <p className={styles.contentDataP}>{student.name || "N/A"}</p>
                </div>
                <div className={styles.contentStatusBox}>
                  <p
                    className={`${styles.contentStatus} ${
                      student.status && student.status !== "N/A"
                        ? styles[`contentStatus${student.status.toLowerCase()}`]
                        : ""
                    }`}
                  >
                    {student.status?.toLowerCase() || "not yet marked"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>No student found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
