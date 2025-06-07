import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import useTableHeight from "../../utility/setHeight";
import styles from "../../styles/modules/public/Students.module.css";
import Spinner from "../../components/Spinner/Spinner";
import { useData } from "../../context/DataContext";
import Input from "../../components/Input/Input";
import apiRequest from "../../utility/apiRequest";
import { toast } from "react-toastify";

const statuses = ["Present", "Absent", "UFM", "All"];

const DisplayDuty = () => {
  const [search, setSearch] = useState("");
  const [activeBtn, setActiveBtn] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { tableHeight } = useTableHeight();

  const { token } = useAuth();
  const {
    studentlist,
    setStudentList,
    facultyData,
    selectedShift,
    selectedBuilding,
    selectedRoomNo,
    setCurrentIdx,
  } = useData();
  const navigate = useNavigate();
  const { state } = useLocation();

  const secondTeacher = state?.secondTeacher || "N/A";

  const fetchData = async () => {
    const response = await apiRequest({
      url: `/faculty/studentList?shift=${selectedShift}`,
      method: "GET",
      token,
      setLoading,
      setError,
    });

    if (response.status === "success") {
      const students = response.data?.students;

      if (Array.isArray(students)) {
        setStudentList(students);
      } else {
        setError("Unexpected response format: students list not found.");
        console.error("Invalid data format:", response.data);
      }
    } else {
      setError("Failed to load students data.");
      toast.error("Failed to load students data.");
    }
  };

  useEffect(() => {
    if (!(selectedShift && selectedBuilding && selectedRoomNo)) {
      toast.info("Please select a room and shift");
      navigate("/faculty/displayDuty");
      return;
    }
    if (!Array.isArray(studentlist) || studentlist.length === 0) {
      fetchData();
    }
  }, []);

  const filteredStudents = useMemo(() => {
    return studentlist
      .filter(
        (student) =>
          activeBtn === "All" ||
          student.status.toLowerCase() === activeBtn.toLowerCase()
      )
      .filter((student) => {
        const query = search.toLowerCase();
        return (
          student.name.toLowerCase().includes(query) ||
          student.rollNo.toLowerCase().includes(query)
        );
      });
  }, [studentlist, activeBtn, search]);

  const getNoOfStudent = (status) => {
    if (status === "All") return studentlist.length;
    return studentlist.filter(
      (s) => s.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const handleClick = (index) => {
    setCurrentIdx(index);
    navigate("/faculty/markAttendance");
  };

  if (error) {
    return <ErrorBox error={error} onclick={fetchData} />;
  }

  return (
    <div className={styles.parent}>
      {/* headder container  */}
      <div className={styles.roomInfo} id="header">
        <p className={styles.roomInfoP}>
          Room no: {selectedBuilding + " " + selectedRoomNo || "N/A"}
        </p>
        <p className={styles.roomInfoP}>
          Duty: {facultyData.fName} , {secondTeacher}
        </p>
        <p className={styles.roomInfoP}>Shift: {selectedShift || "N/A"}</p>
      </div>

      {/* second container */}
      <div className={styles.Studentlist} id="container">
        {/* filter bar */}
        <div className={styles.filterBtns} id="filterContainer">
          {statuses.map((status) => {
            return (
              <div key={status}>
                <button
                  onClick={() => setActiveBtn(status)}
                  className={`${styles.filterBtn} ${
                    activeBtn === status ? styles[`filterBtn${status}`] : ""
                  }`}
                >
                  {getNoOfStudent(status)}
                </button>
                <p className={styles.filterBtnP}>{status}</p>
              </div>
            );
          })}
        </div>

        {/* search box */}
        <div className={styles.searchBox} id="searchBox">
          <Input
            type={4}
            role={"text"}
            placeholder={"Search student by roll no. or name"}
            value={search}
            setValue={(val) => setSearch(val)}
          />
        </div>

        {/* student list */}
        <div className={styles.contentBox} style={{ height: tableHeight }}>
          {loading ? (
            <Spinner color="white" fullPage size="large" />
          ) : filteredStudents.length > 0 ? (
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
                    {student.status && student.status !== "N/A"
                      ? student.status.toLowerCase()
                      : "not yet marked"}
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

export default DisplayDuty;
