import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import spinnerStyles from "./CSS/Spinner.module.css";
import errorStyles from "./CSS/Error.module.css";
import useTableHeight from "../SetHeight";
import styles from "./CSS/Students.module.css";

const statuses = ["Present", "Absent", "UFM", "All"];

const DisplayDuty = () => {
  const [search, setSearch] = useState("");
  const [activeBtn, setActiveBtn] = useState("All");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh , setRefresh] = useState(false);

  const {tableHeight} =  useTableHeight();
  

  const { token } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const shift = state?.shift;
  const buildingName = state?.buildingName;
  const roomNo = state?.roomNo;
  const fName = state?.fName || "N/A";
  const secondTeacher = state?.secondTeacher || "N/A";

  useEffect(() => {
    if (!(shift && buildingName && roomNo)) {
      navigate("/displayDuty");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://gbu-server.vercel.app/api/faculty/studentList",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch data`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }

        setDataList(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token,refresh]);

  const filteredStudents = useMemo(() => {
    return dataList
      .filter(
        (student) => activeBtn === "All" || student.status === activeBtn
      )
      .filter((student) => {
        const query = search.toLowerCase();
        return (
          student.name.toLowerCase().includes(query) ||
          student.rollNo.toLowerCase().includes(query)
        );
      });
  }, [dataList, activeBtn, search]);


  const handleClick = (index)=>{
    navigate("/markAttendance",{state:{dataList,index}})
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
                <button className={errorStyles.retryBtn} onClick={()=>setRefresh(prev=>!prev)}>
                  Retry
                </button>
              </div>
      ) : (
        <>
          <div className={styles.roomInfo} id="header">
            <p className={styles.roomInfoP}>Room no: {roomNo || "N/A"}</p>
            <p className={styles.roomInfoP}>
              Duty: {fName} , {secondTeacher}
            </p>
            <p className={styles.roomInfoP}>Shift: {shift || "N/A"}</p>
          </div>

          <div className={styles.Studentlist} id="container">
            <div className={styles.filterBtns} id="filterContainer">
              {statuses.map((status) => {
                const count =
                  status === "All"
                    ? dataList.length
                    : dataList.filter((s) => s.status === status).length;

                return (
                  <div key={status}>
                    <button
                      onClick={() => setActiveBtn(status)}
                      className={`${styles.filterBtn} ${
                        activeBtn === status ? styles[`filterBtn${status}`] : ""
                      }`}
                    >
                      {count}
                    </button>
                    <p className={styles.filterBtnP}>{status}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles.searchBox} id="searchBox" >
              <input
                type="text"
                placeholder="Search student by roll no. or name"
                className={styles.searchInputBox}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.contentBox} style={{maxHeight:tableHeight || "665px"}}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student,index) => (
                  <div key={student.rollNo} className={styles.content} onClick={()=>handleClick(index)}>
                    <div className={styles.contentData}>
                      <p className={styles.contentDataP}>
                        {student.rollNo || "N/A"}
                      </p>
                      <p className={styles.contentDataP}>
                        {student.name || "N/A"}
                      </p>
                    </div>

                    <div className={styles.contentStatusBox}>
                      <p
                        className={`${styles.contentStatus} ${
                          student.status && student.status !== "N/A"
                            ? styles[
                                `contentStatus${student.status.toLowerCase()}`
                              ]
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
        </>
      )}
    </div>
  );
};

export default DisplayDuty;
