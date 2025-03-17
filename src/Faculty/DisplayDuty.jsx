import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import styles from "./CSS/DisplayDuty.module.css";
import errorStyles from "./CSS/Error.module.css";
import spinnerStyles from "./CSS/Spinner.module.css";
import profileMale from "../assets/profileMale.jpg";

const DisplayDuty = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh , setRefresh] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://gbu-server.vercel.app/api/faculty/preview",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`Error ${response.status}: Failed to fetch data`);

        const data = await response.json();

        setDataList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token,refresh]);

  const handleClick = (shift,buildingName,roomNo,fName,secondTeacher) => {
    navigate('/students', { state: { shift,buildingName,roomNo,fName,secondTeacher } });
  };

  return (
    <div className={styles.parent}>
      {loading ? (
        <div className={`${spinnerStyles.spinnerContainer} ${styles.spinner}`}>
          <div className={spinnerStyles.spinner}></div>
        </div>
      ) : error ? (
        <div className={errorStyles.errorBox}>
        <p className={errorStyles.errorp}>{error}</p>
        <button className={errorStyles.retryBtn} onClick={()=>setRefresh(prev=>!prev)} >
          Retry
        </button>
      </div>
      ) : (
        <>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {/* <img className={styles.img} src={profileMale} alt="User Profile" /> */}
              <p className={styles.userNameP}>
                Hey{" "}
                {dataList.length > 0 ? dataList[0].fName.split(" ")[0] : "User"}
              </p>
            </div>

            <div className={styles.text}>
              <p className={styles.textP}>Your Exam Duty</p>
            </div>
          </div>

          {/* Duty List Section */}
          <div className={styles.work}>
            <div className={styles.contentBox}>
              {dataList.length > 0 ? (
                dataList.map((duty, index) => (
                  <div
                    key={index}
                    className={styles.content}
                    onClick={() =>
                      handleClick(duty.shift,duty.buildingName,duty.roomNo,duty.fName,duty.secondTeacher)
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
        </>
      )}
    </div>
  );
};

export default DisplayDuty;
