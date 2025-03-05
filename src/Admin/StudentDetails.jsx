import { useState } from "react";
import styles from "./StudentDetails.module.css"

const StudentDetails = () => {
  const [rollno,setRollno]=useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Enter roll number"
        className={styles.rollnoInput}
        value={rollno}
        onChange={(e) => setRollno(e.target.value.toUpperCase())}
        required
      />
      <button className={styles.rollnoInputSBtn}>Search</button>
    </div>
  );
};
export default StudentDetails;
