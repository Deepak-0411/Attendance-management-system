import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/modules/public/DisplayDuty.module.css";
import errorStyles from "../../styles/modules/public/Error.module.css";
import useTableHeight from "../../utility/setHeight";
import Spinner from "../../components/Spinner/Spinner";
import apiRequest from "../../utility/apiRequest";

const DisplayDuty = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const tableHeight = useTableHeight();

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await apiRequest({
      url: "/faculty/preview",
      method: "GET",
      token: token,
      setLoading,
      setError,
    });

    if (response.status === "success") {
      setDataList(response.data);
    } else {
      console.error("Error:", response.message);
      setDataList(response.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, refresh]);

  const handleClick = (shift, buildingName, roomNo, fName, secondTeacher) => {
    navigate("faculty/students", {
      state: { shift, buildingName, roomNo, fName, secondTeacher },
    });
  };

  return (
    <div className={styles.parent}>
      {loading ? (
        <Spinner color="white" />
      ) : error ? (
        <div className={errorStyles.errorBox}>
          <p className={errorStyles.errorp}>{error}</p>
          <button
            className={errorStyles.retryBtn}
            onClick={() => setRefresh((prev) => !prev)}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className={styles.userInfo} id="header">
            <div className={styles.userName}>
              {/* <img className={styles.img} src={profileMale} alt="User Profile" /> */}
              <p className={styles.userNameP}>
                Hey {dataList.faculty?.fName.split(" ")[0] || "User"}
              </p>
            </div>

            <div className={styles.text}>
              <p className={styles.textP}>Your Exam Duty</p>
            </div>
          </div>

          {/* Duty List Section */}
          <div className={styles.work} style={{ maxHeight: tableHeight }}>
            <div className={styles.contentBox}>
              {dataList.viewDuty.length > 0 ? (
                dataList.viewDuty.map((duty, index) => (
                  <div
                    key={index}
                    className={styles.content}
                    onClick={() =>
                      handleClick(
                        duty.shift,
                        duty.buildingName,
                        duty.roomNo,
                        dataList.faculty?.fName,
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
        </>
      )}
    </div>
  );
};

export default DisplayDuty;
