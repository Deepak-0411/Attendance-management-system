import { useEffect, useState , useMemo } from "react";
import styles from "./Students.module.css";

const DisplayDuty = () => {
  const [search, setSearch] = useState("");
  const [activeBtn, setActiveBtn] = useState("All");

  const [studentsData, setStudentsData] = useState([
    { id: 1, roll: "101", name: "Amit", status: "Present" },
    { id: 2, roll: "102", name: "Raj", status: "Absent" },
    { id: 3, roll: "103", name: "Neha", status: "UFM" },
    { id: 4, roll: "104", name: "Sara", status: "Present" },
    { id: 1, roll: "101", name: "Amit", status: "Present" },
    { id: 2, roll: "102", name: "Raj", status: "Absent" },
    { id: 3, roll: "103", name: "Neha", status: "UFM" },
    { id: 4, roll: "104", name: "Sara", status: "Present" },
    { id: 1, roll: "101", name: "Amit", status: "Present" },
    { id: 2, roll: "102", name: "Raj", status: "Absent" },
    { id: 3, roll: "103", name: "Neha", status: "UFM" },
    { id: 4, roll: "104", name: "Sara", status: "Present" },
    { id: 1, roll: "101", name: "Amit", status: "Present" },
    { id: 2, roll: "102", name: "Raj", status: "Absent" },
    { id: 3, roll: "103", name: "Neha", status: "UFM" },
    { id: 4, roll: "104", name: "Sara", status: "Present" },
    { id: 1, roll: "101", name: "Amit", status: "Present" },
    { id: 2, roll: "102", name: "Raj", status: "Absent" },
    { id: 3, roll: "103", name: "Neha", status: "UFM" },
    { id: 4, roll: "104", name: "Sara", status: "Present" },
    { id: 1, roll: "101", name: "Amit", status: "Present" },
    { id: 2, roll: "102", name: "Raj", status: "Absent" },
    { id: 3, roll: "103", name: "Neha", status: "UFM" },
    { id: 4, roll: "104", name: "Sara", status: "Present" },
  ]);

  const filteredStudents = useMemo(() => 
    studentsData
      .filter((student) => activeBtn === "All" || student.status === activeBtn)
      .filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.roll.includes(search)
      ),
    [studentsData, activeBtn, search]
  );
  return (
    <div className={styles.parent}>
      <div className={styles.roomInfo}>
        <p className={styles.roomInfoP}>Room no - IL201</p>
        <p className={styles.roomInfoP}>Duty - Teacher 1 , Teacher 2</p>
        <p className={styles.roomInfoP}>Timings - 2pm to 5pm</p>
        <p className={styles.roomInfoP}>Shift - 1</p>
      </div>


      <div className={styles.Studentlist}>
        <div className={styles.filterBtns}>
          {["Present", "Absent", "UFM", "All"].map((status) => (
            <div key={status}>
              <button
                onClick={() => setActiveBtn(status)}
                className={`${styles.filterBtn} ${
                  activeBtn === status ? styles[`filterBtn${status}`] : ""
                }`}
              >
                {
                  studentsData.filter(
                    (s) => status === "All" || s.status === status
                  ).length
                }
              </button>
              <p className={styles.filterBtnP}>{status}</p>
            </div>
          ))}
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search student by roll no. or name"
            className={styles.searchInputBox}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </div>

        <div className={styles.contentBox}>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.id} className={styles.content}>
                <div className={styles.contentData}>
                  <p className={styles.contentDataP}>{student.roll}</p>
                  <p className={styles.contentDataP}>{student.name}</p>
                </div>

                <div className={styles.contentStatusBox}>
                <p className={`${styles.contentStatus} ${styles[`contentStatus${student.status}`]}`} >{student.status}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>No students found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayDuty;
