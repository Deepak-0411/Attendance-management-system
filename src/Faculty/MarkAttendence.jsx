import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import errorStyles from "./CSS/Error.module.css";
import styles from "./CSS/MarkAttendence.module.css";
import spinnerStyles from "./CSS/Spinner.module.css";
import ScanSheet from "./ScanSheet";

const MarkAttendence = () => {
  const { token } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dataList, setDataList] = useState(state?.dataList || []);
  const [index, setIndex] = useState(state?.index || 0);
  const [scanning, setScanning] = useState(false);
  const [sheetNo, setSheetNo] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataList || dataList.length === 0) {
      setErrorMsg("Some error occurred: No data found");
      setShowError(true);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showError) {
      timer = setTimeout(() => setShowError(false), 2500);
    }
    return () => clearTimeout(timer);
  }, [showError]);

  const showErrorBox = (msg) => {
    msg.includes("Marked") ? setSuccessMsg(msg) : setErrorMsg(msg);
    setShowError(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus !== "Absent" && !sheetNo) {
      showErrorBox("Error: No sheet number found!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://gbu-server.vercel.app/api/faculty/markStatus",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rollNo: dataList[index].rollNo,
            bookletNumber: sheetNo,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.message}`);
      }

      const updatedList = [...dataList];
      updatedList[index] = {
        ...updatedList[index],
        status: newStatus,
        bookletNumber: sheetNo,
      };
      setDataList(updatedList);
      setSheetNo("");
      showErrorBox(`Marked as ${newStatus}`);
    } catch (err) {
      showErrorBox(err.message || "API Error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSheetNo("");
    }
  };

  const handleNext = () => {
    if (index < dataList.length - 1) {
      setIndex(index + 1);
      setSheetNo("");
    }
  };

  const student = dataList[index];

  if (!student) {
    return (
      <div className={styles.container}>
        <div className={errorStyles.errorBox}>
          <p className={errorStyles.errorp}>No student data found</p>
          <button
            className={errorStyles.retryBtn}
            onClick={() => navigate("/displayDuty")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Error Message */}
      <div
        className={`${(successMsg)?styles.successMsgBox : styles.errorBox} ${showError ? styles.errorBoxShow : ""}`}
      >
        <p>{errorMsg}</p>
      </div>

      <div className={styles.card}>
        {/* Student Details */}
        <div className={styles.detailsContainer}>
          <p className={styles.details}>Name: {student.name || "N/A"}</p>
          <p className={styles.details}>Roll no: {student.rollNo || "N/A"}</p>
          <p className={styles.details}>
            Course Code: {student.courseCode || "N/A"}
          </p>
          <p className={styles.details}>
            Course Name: {student.courseName || "N/A"}
          </p>
          <p className={styles.details}>
            Programme Name: {student.programmeName || "N/A"}
          </p>
          <p className={styles.details}>Status: {student.status || "N/A"}</p>
          <p className={styles.details}>
            Sheet no: {student.bookletNumber || sheetNo || "N/A"}
          </p>
        </div>

        {/* QR Scan Button */}
        <div className={styles.scanSheet}>
          <button
            className={styles.scanButton}
            onClick={() => setScanning(!scanning)}
          >
            Scan Sheet
          </button>
          {scanning && (
            <div className={styles.ScanSheetOverlay}>
              <ScanSheet
                closeDiv={() => setScanning(false)}
                setSheet={(scannedSheetNo) => setSheetNo(scannedSheetNo)}
              />
            </div>
          )}
        </div>

        {loading && (
          <div
            className={`${spinnerStyles.spinnerContainer} ${styles.spinner}`}
          >
            <div className={spinnerStyles.spinner}></div>
          </div>
        )}

        {/* Status Buttons */}
        <div className={styles.statusButtons}>
          <button
            className={styles.presentBtn}
            onClick={() => handleStatusChange("Present")}
            disabled={loading}
          >
            Present
          </button>
          <button
            className={styles.absentBtn}
            onClick={() => handleStatusChange("Absent")}
            disabled={loading}
          >
            Absent
          </button>
          <button
            className={styles.ufmBtn}
            onClick={() => handleStatusChange("UFM")}
            disabled={loading}
          >
            UFM
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.navButtons}>
          <button
            className={styles.back}
            onClick={handleBack}
            disabled={index === 0 || loading}
          >
            &lt;- Back
          </button>
          <button
            className={styles.next}
            onClick={handleNext}
            disabled={index === dataList.length - 1 || loading}
          >
            Next -&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendence;
