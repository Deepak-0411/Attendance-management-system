import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/modules/public/DisplayDuty.module.css";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import useTableHeight from "../../utility/setHeight";
import { useData } from "../../context/DataContext";
import Spinner from "../../components/Spinner/Spinner";

const DisplayDuty = () => {
  const { token, logout } = useAuth();
  const { facultyName, facultyDuty, getFacultyInfo } = useData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {tableHeight} = useTableHeight();

  const navigate = useNavigate();
  
  useEffect(() => {    
    const needsData = facultyName.length === 0 && facultyDuty.length === 0;

    if (needsData) {
      getFacultyInfo(token, setLoading, setError);
    } else {
      setLoading(false);
    }
  }, []);

  const handleClick = (shift, buildingName, roomNo, secondTeacher) => {
    sessionStorage.setItem("shift", shift);
    sessionStorage.setItem("building", buildingName);
    sessionStorage.setItem("room", roomNo);
    navigate("/faculty/students", { state: { secondTeacher } });
  };

  if (loading) return <Spinner color="white" fullPage size="large" />;

  if (error)
    return (
      <ErrorBox
        error={error}
        onClick={() => getFacultyInfo(token, setLoading, setError)}
      />
    );

  return (
    <div className={styles.parent}>
      <div className={styles.userInfo} id="header">
        <div className={styles.userName}>
          <p className={styles.userNameP}>
            Hey {facultyName?.fName?.split?.(" ")[0] || "User"}
          </p>
        </div>

        <div className={styles.text}>
          <p className={styles.textP}>Your Exam Duty</p>
        </div>
      </div>

      {/* Duty List Section */}
      <div className={styles.work} style={{ maxHeight: tableHeight }}>
        <div className={styles.contentBox}>
          {facultyDuty.length > 0 ? (
            facultyDuty.map((duty, index) => (
              <div
                key={index}
                className={styles.content}
                onClick={() =>
                  handleClick(
                    duty.shift,
                    duty.buildingName,
                    duty.roomNo,
                    duty.secondTeacher
                  )
                }
              >
                <div className={styles.contentData}>
                  <p className={styles.contentDataP}>
                    {duty.buildingName + " - " + duty.roomNo}
                  </p>
                  <p className={styles.contentDataP}>
                    {"Shift - " + duty.shift}
                  </p>
                </div>
                <div className={styles.contentData}>
                  <p className={styles.contentDataP}>
                    {duty.secondTeacher || "Not Assigned"}
                  </p>
                  <p className={styles.contentDataP}>
                    {duty.totalStrength || "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No duty assigned</p>
          )}
        </div>
      </div>

      {/* Logout Btn */}
      <div className={styles.logoutBtnBox}>
        <button onClick={logout} className={styles.logoutBtn}>
          LOGOUT
          <span id={styles.logoutSpan}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M17.5 7L16.09 8.41L18.67 11H8.5V13H18.67L16.09 15.58L17.5 17L22.5 12L17.5 7ZM4.5 5H12.5V3H4.5C3.4 3 2.5 3.9 2.5 5V19C2.5 20.1 3.4 21 4.5 21H12.5V19H4.5V5Z"
                fill="#000"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default DisplayDuty;
