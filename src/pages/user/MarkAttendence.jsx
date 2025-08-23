import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import styles from "../../styles/modules/public/MarkAttendence.module.css";
import ScanSheet from "./ScanSheet";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import { apiRequest } from "../../utility/apiRequest";
import Overlay from "../../components/Overlay/Overlay";

const MarkAttendence = () => {
  const {
    studentlist: fullStudentList,
    fetchStudents,
    setStudentList,
  } = useData();
  const navigate = useNavigate();

  const selectedShift = sessionStorage.getItem("shift");
  const rollNoFromStorage = sessionStorage.getItem("rollNo");
  const filteredRollNos = JSON.parse(
    sessionStorage.getItem("filteredRollNos") || "[]"
  );

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sheetNo, setSheetNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [isEditingSheet, setIsEditingSheet] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedShift) {
      toast.info("Please select a room and shift");
      navigate("/faculty/displayDuty");
      return;
    }
  }, []);

  useEffect(() => {
    if (!fullStudentList?.length) {
      fetchStudents(selectedShift, setLoading, setError);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fullStudentList?.length && filteredRollNos?.length) {
      const newFiltered = fullStudentList.filter((s) =>
        filteredRollNos.includes(s.rollNo)
      );

      const foundIndex = newFiltered.findIndex(
        (s) => s.rollNo === rollNoFromStorage
      );

      setFilteredStudents(newFiltered);
      setCurrentIdx(foundIndex >= 0 ? foundIndex : 0);
    }
  }, [fullStudentList]);

  useEffect(() => {
    if (filteredStudents[currentIdx]) {
      sessionStorage.setItem("rollNo", filteredStudents[currentIdx].rollNo);
    }
  }, [currentIdx, filteredStudents]);

  const student = filteredStudents?.[currentIdx];

  const handleStatusChange = async (newStatus) => {
    if (!student) return;

    const validSheet = newStatus === "Absent" || sheetNo;
    if (!validSheet) {
      toast.warn("Error: No valid sheet number found!");
      return;
    }

    const response = await apiRequest({
      url: `/api/invigilator/markStatus`,
      method: "PATCH",
      body: {
        rollNo: student.rollNo,
        bookletNumber: sheetNo,
        status: newStatus,
      },
      setLoading,
    });

    if (response.status === "success") {
      const updatedList = [...filteredStudents];
      updatedList[currentIdx] = {
        ...updatedList[currentIdx],
        status: newStatus,
        bookletNumber: sheetNo,
      };
      setFilteredStudents(updatedList);
      setStudentList(
        fullStudentList.map((s) =>
          s.rollNo === student.rollNo
            ? { ...s, status: newStatus, bookletNumber: sheetNo }
            : s
        )
      );
      setSheetNo("");
      toast.success(`Marked as ${newStatus}`);
    } else {
      toast.error(`Failed to update status: ${response.message}`);
    }
  };

  const valueToShow = [
    ["Name", student?.name],
    ["Roll no", student?.rollNo],
    ["Course Code", student?.courseCode],
    ["Course Name", student?.courseName],
    ["Programme", student?.programme],
    ["Branch", student?.branch],
    ["Status", student?.status],
    ["Sheet no", student?.bookletNumber],
    [
      "Scanned no",
      isEditingSheet ? (
        <input
          type="text"
          className={styles.inputField}
          value={sheetNo}
          onChange={(e) => {
            const newValue = e.target.value;
            if (/^\d*$/.test(newValue)) {
              setSheetNo(newValue);
            }
          }}
          onBlur={() => setIsEditingSheet(false)}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditingSheet(true)}
          style={{ background: "#76767640" }}
        >
          {sheetNo || "No sheet scanned yet"}
        </span>
      ),
    ],
  ];

  if (error) {
    return (
      <ErrorBox
        error={error}
        onClick={() => fetchStudents(selectedShift, setLoading, setError)}
      />
    );
  }

  if (loading && filteredStudents.length === 0) {
    return <Spinner color="white" fullPage size="large" />;
  }

  if (!loading && filteredStudents.length === 0 && fullStudentList.length > 0) {
    return (
      <ErrorBox
        error="No students matched your filters."
        onClick={() => navigate("/faculty/displayDuty")}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Student Details */}
        <div className={styles.detailsContainer}>
          {valueToShow.map(([label, value]) => (
            <div key={label} className={styles.detailRow}>
              <strong>{label} :</strong>
              <span className={styles.truncateText}>{value || "N/A"}</span>
            </div>
          ))}
        </div>

        {/* Scanner */}
        <div className={styles.scanSheet}>
          <button
            className={styles.scanButton}
            onClick={() => setScanning(true)}
          >
            Scan Sheet
          </button>
          {scanning && (
            <Overlay onClose={() => setScanning(false)}>
              <ScanSheet
                setSheet={(scanned) => setSheetNo(scanned)}
                closeDiv={() => setScanning(false)}
              />
            </Overlay>
          )}
        </div>

        {/* Spinner */}
        {loading && (
          <div className={styles.overlay}>
            <Spinner color="white" fullPage size="large" />
          </div>
        )}

        {/* Status Buttons */}
        <div className={styles.statusButtons}>
          {["Present", "Absent", "UFM"].map((status) => (
            <button
              key={status}
              className={styles[`${status.toLowerCase()}Btn`]}
              onClick={() => handleStatusChange(status)}
              disabled={loading}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.navButtons}>
          <button
            className={styles.back}
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0 || loading}
          >
            {icon("back", currentIdx === 0 || loading)} Back
          </button>
          <button
            className={styles.next}
            onClick={() =>
              setCurrentIdx(
                Math.min(filteredStudents.length - 1, currentIdx + 1)
              )
            }
            disabled={currentIdx === filteredStudents.length - 1 || loading}
          >
            Next{" "}
            {icon(
              "frwd",
              currentIdx === filteredStudents.length - 1 || loading
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendence;

// SVG Icon component
const icon = (type, isDisabled) => (
  <svg
    width="18px"
    height="18px"
    viewBox="0 0 24.00 24.00"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform={
      type === "frwd" ? "matrix(1, 0, 0, 1, 0, 0)" : "matrix(-1, 0, 0, 1, 0, 0)"
    }
    stroke={isDisabled ? "#ffffff24" : "#fff"}
    strokeWidth="0.336"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
      fill={isDisabled ? "#ffffff24" : "#fff"}
    />
  </svg>
);
