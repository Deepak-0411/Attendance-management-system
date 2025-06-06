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
  const { studentlist, setStudentList, currentIdx, setCurrentIdx } = useData();
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(false);
  const [sheetNo, setSheetNo] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditingSheet, setIsEditingSheet] = useState(false);

  const student = studentlist?.[currentIdx];

  useEffect(() => {
    if (!studentlist?.length) {
      toast.info("Failed to get student data.");
      navigate("/faculty/displayDuty");
    }
  }, [studentlist, navigate]);

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
      setSheetNo("No sheet scanned yet");
      toast.success(`Marked as ${newStatus}`);
    } else {
      toast.error(`Failed to update status: ${response.message}`);
    }
  };

  if (!student) {
    return (
      <ErrorBox
        error="No student data found"
        onclick={() => navigate("/faculty/displayDuty")}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Student Details Grid */}
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
                  className={styles.inputField}
                  value={sheetNo}
                  onChange={(e) => setSheetNo(e.target.value)}
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

        {/* QR Scanner */}
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
                setSheet={(scannedSheetNo) => setSheetNo(scannedSheetNo)}
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

        {/* Navigation Buttons */}
        <div className={styles.navButtons}>
          <button
            className={styles.back}
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0 || loading}
          >
            &lt;- Back
          </button>
          <button
            className={styles.next}
            onClick={() =>
              setCurrentIdx((prev) =>
                Math.min(studentlist.length - 1, prev + 1)
              )
            }
            disabled={currentIdx === studentlist.length - 1 || loading}
          >
            Next {forwardIcon}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendence;
const forwardIcon = (
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 960 960"
  fill="#FFFFFF"
  style={{"display": "block"}}
>
  <path d="M400 680V280l200 200-200 200Z" />
</svg>


);
