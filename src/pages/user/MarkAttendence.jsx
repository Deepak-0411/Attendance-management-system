import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import errorStyles from "../../styles/modules/public/Error.module.css";
import styles from "../../styles/modules/public/MarkAttendence.module.css";
import ScanSheet from "./ScanSheet";
import Spinner from "../../components/Spinner/Spinner";

const MarkAttendence = () => {
  const { token } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const sessionData = JSON.parse(sessionStorage.getItem("markAttendanceState") || "{}");

  const [dataList, setDataList] = useState(sessionData.dataList || []);
  const [index, setIndex] = useState(sessionData.index || 0);
  const [scanning, setScanning] = useState(false);
  const [sheetNo, setSheetNo] = useState("");
  const [showMsgBox, setShowMsgBox] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);  

  useEffect(() => {
    if (!dataList || dataList.length === 0) {
      navigate("/displayDuty");
    }
  }, []);
  

  useEffect(() => {
    let timer;
    if (showMsgBox) {
      timer = setTimeout(() => setShowMsgBox(false), 2500);
    }
    return () => clearTimeout(timer);
  }, [showMsgBox]);



  const handleStatusChange = async (newStatus) => {
    if (newStatus !== "Absent" && !sheetNo) {
      setMessage({ type: "error", text: "Error: No sheet number found!" });
      setShowMsgBox(true);
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
      sessionStorage.setItem(
        "markAttendanceState",
        JSON.stringify({ dataList: updatedList, index })
      );
      setSheetNo("");
      //Sucess msg
      setMessage({ type: "success", text: `Marked as ${newStatus}` });
      setShowMsgBox(true);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "API Error" });
      setShowMsgBox(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      const newIndex = index - 1;
    setIndex(newIndex);
    setSheetNo("");
    sessionStorage.setItem(
      "markAttendanceState",
      JSON.stringify({ dataList, index: newIndex })
    );
    }
  };

  const handleNext = () => {
    if (index < dataList.length - 1) {
      const newIndex = index + 1;
    setIndex(newIndex);
    setSheetNo("");
    sessionStorage.setItem(
      "markAttendanceState",
      JSON.stringify({ dataList, index: newIndex })
    );
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
        className={`${message.type === "success" ?styles.successMsgBox : styles.errorBox} ${showMsgBox ? styles.msgBoxShow : ""}`}>
      
        <p>{message.text}</p>
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
            Sheet no: {student.bookletNumber  || "N/A"}
          </p>
          <p className={styles.details}>
            Scanned no: { sheetNo || "N/A"}
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
            <div className={styles.overlay}>
              <ScanSheet
                closeDiv={() => setScanning(false)}
                setSheet={(scannedSheetNo) => setSheetNo(scannedSheetNo)}
              />
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.overlay}>
            <Spinner color="white"/>
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
