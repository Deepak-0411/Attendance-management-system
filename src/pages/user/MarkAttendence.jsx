import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import styles from "../../styles/modules/public/MarkAttendence.module.css";
import ScanSheet from "./ScanSheet";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import apiRequest from "../../utility/apiRequest";
import Overlay from "../../components/Overlay/Overlay";

const MarkAttendence = () => {
  const { token } = useAuth();
  const selectedShift = sessionStorage.getItem("shift");
  const selectedIdx = Number(sessionStorage.getItem("index")) || 0;
  const { studentlist, setStudentList, fetchStudents } = useData();
  const navigate = useNavigate();

  const [sheetNo, setSheetNo] = useState("");
  const [currentIdx, setCurrentIdx] = useState(selectedIdx);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isEditingSheet, setIsEditingSheet] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentlist?.length) {
      fetchStudents(selectedShift, token, setLoading, setError);
    }
    if (studentlist?.length && currentIdx >= studentlist.length) {
      setCurrentIdx(0);
    }
  }, [studentlist]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (studentlist?.length) {
        sessionStorage.setItem("index", currentIdx);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentIdx, studentlist]);

  const student = studentlist?.[currentIdx];

  const handleStatusChange = async (newStatus) => {
    if (!student) return;

    const validSheet = newStatus === "Absent" || sheetNo;
    if (!validSheet) {
      toast.warn("Error: No valid sheet number found!");
      return;
    }

    const response = await apiRequest({
      url: `/faculty/markStatus`,
      method: "PATCH",
      token,
      body: {
        rollNo: student.rollNo,
        bookletNumber: sheetNo,
        status: newStatus,
      },
      setLoading,
    });

    if (response.status === "success") {
      const updatedList = [...studentlist];
      updatedList[currentIdx] = {
        ...updatedList[currentIdx],
        status: newStatus,
        bookletNumber: sheetNo,
      };
      setStudentList(updatedList);
      setSheetNo("");
      toast.success(`Marked as ${newStatus}`);
    } else {
      toast.error(`Failed to update status: ${response.message}`);
    }
  };

  if (error)
    return (
      <ErrorBox
        error={error}
        onClick={() =>
          fetchStudents(selectedShift, token, setLoading, setError)
        }
      />
    );

  if (!student) {
    return (
      <ErrorBox
        error="No student data found"
        onClick={() => navigate("/faculty/displayDuty")}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Student Details */}
        <div className={styles.detailsContainer}>
          {[
            ["Name", student.name],
            ["Roll no", student.rollNo],
            ["Course Code", student.courseCode],
            ["Course Name", student.courseName],
            ["Programme", student.programmeName],
            ["Status", student.status],
            ["Sheet no", student.bookletNumber],
            [
              "Scanned no",
              isEditingSheet ? (
                <input
                  type="number"
                  min={0}
                  className={styles.inputField}
                  value={sheetNo}
                  onChange={(e) => setSheetNo(Math.max(0, e.target.value))}
                  onBlur={() => setIsEditingSheet(false)}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => setIsEditingSheet(true)}>
                  {sheetNo || "No sheet scanned yet"}
                </span>
              ),
            ],
          ].map(([label, value]) => (
            <div key={label} className={styles.detailRow}>
              <strong>{label} :</strong>
              <span>{value || "N/A"}</span>
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
              <ScanSheet setSheet={(scanned) => setSheetNo(scanned)} />
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
              setCurrentIdx(Math.min(studentlist.length - 1, currentIdx + 1))
            }
            disabled={currentIdx === studentlist.length - 1 || loading}
          >
            Next{" "}
            {icon("frwd", currentIdx === studentlist.length - 1 || loading)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendence;

// SVG Icon
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
