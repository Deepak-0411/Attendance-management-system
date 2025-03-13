import { useEffect, useState, useMemo } from "react";
import styles from "./CSS/Students.module.css";

const DisplayDuty = () => {
  const [search, setSearch] = useState("");
  const [activeBtn, setActiveBtn] = useState("All");

  const [studentsData, setStudentsData] = useState([
    { roll: "235/UCS/101", name: "Amit", status: "" },
    { roll: "235/UCS/102", name: "Raj", status: "Absent" },
    { roll: "235/UCS/103", name: "Neha", status: "" },
    { roll: "235/UCS/104", name: "Sara", status: "Present" },
    { roll: "235/UCS/105", name: "Vikram", status: "" },
    { roll: "235/UCS/106", name: "Priya", status: "Present" },
    { roll: "235/UCS/107", name: "Alok", status: "UFM" },
    { roll: "235/UCS/108", name: "Manoj", status: "Absent" },
    { roll: "235/UCS/109", name: "Simran", status: "" },
    { roll: "235/UCS/110", name: "Kabir", status: "Present" },
    { roll: "235/UCS/111", name: "Ravi", status: "Absent" },
    { roll: "235/UCS/112", name: "Kiran", status: "UFM" },
    { roll: "235/UCS/113", name: "Suman", status: "Present" },
    { roll: "235/UCS/114", name: "Deepak", status: "Absent" },
    { roll: "235/UCS/115", name: "Anjali", status: "UFM" },
    { roll: "235/UCS/116", name: "Rohit", status: "Present" },
    { roll: "235/UCS/117", name: "Pooja", status: "Absent" },
    { roll: "235/UCS/118", name: "Arjun", status: "Present" },
    { roll: "235/UCS/119", name: "Sneha", status: "UFM" },
    { roll: "235/UCS/120", name: "Gaurav", status: "Present" },
    { roll: "235/UCS/121", name: "Sunita", status: "Absent" },
    { roll: "235/UCS/122", name: "Harsh", status: "Present" },
    { roll: "235/UCS/123", name: "Meena", status: "UFM" },
    { roll: "235/UCS/124", name: "Rahul", status: "Absent" },
    { roll: "235/UCS/125", name: "Kavita", status: "Present" },
    { roll: "235/UCS/126", name: "Tarun", status: "Absent" },
    { roll: "235/UCS/127", name: "Nisha", status: "UFM" },
    { roll: "235/UCS/128", name: "Suresh", status: "Present" },
    { roll: "235/UCS/129", name: "Varun", status: "Absent" },
    { roll: "235/UCS/130", name: "Maya", status: "Present" },
    { roll: "235/UCS/131", name: "Jatin", status: "UFM" },
    { roll: "235/UCS/132", name: "Payal", status: "Present" },
    { roll: "235/UCS/133", name: "Anil", status: "Absent" },
    { roll: "235/UCS/134", name: "Komal", status: "Present" },
    { roll: "235/UCS/135", name: "Sachin", status: "UFM" },
    { roll: "225/UCM/136", name: "Rina", status: "Absent" },
    { roll: "225/UCM/137", name: "Kaniska", status: "Absent" },
    { roll: "225/UCM/138", name: "UCMs", status: "Absent" },
  ]);

  const filteredStudents = useMemo(
    () =>
      studentsData
        .filter(
          (student) => activeBtn === "All" || student.status === activeBtn
        )
        .filter(
          (student) =>
            student.name.toLowerCase().startsWith(search.toLowerCase()) ||
            student.roll.toLowerCase().includes(search.toLowerCase())
        )
        ,
    [studentsData, activeBtn, search]
  );
return(
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
              <div key={student.roll} className={styles.content}>
                <div className={styles.contentData}>
                  <p className={styles.contentDataP}>{student.roll}</p>
                  <p className={styles.contentDataP}>{student.name}</p>
                </div>

                <div className={styles.contentStatusBox}>
                  <p
                    className={`${styles.contentStatus} ${
                      student.status === ""
                        ? ""
                        : styles[`contentStatus${student.status.toLowerCase()}`]
                    }`}
                  >
                    {student.status === "" ? "not yet marked" : student.status.toLowerCase()}
                  </p>
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
