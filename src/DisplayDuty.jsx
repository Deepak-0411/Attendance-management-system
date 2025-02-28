import { useState } from "react";
import styles from "./DisplayDuty.module.css";
import profileMale from "./assets/profileMale.jpg";

const dutyData = [
  { room: "IL202", shift: "Shift-1", secondTeacher: "38" },
  { room: "IL203", shift: "Shift-2", secondTeacher: "42" },
  { room: "IL204", shift: "Shift-3", secondTeacher: "35" },
];

const DisplayDuty = () => {
  return (
    <div className={styles.parent}>
      {/* User Info Section */}
      <div className={styles.userInfo}>
        <div className={styles.userName}>
          <img className={styles.img} src={profileMale} alt="User" />
          <p className={styles.userNameP}>Hey User!!</p>
        </div>
        <div className={styles.text}>
          <p className={styles.textP}>Your Exam Duty</p>
        </div>
      </div>

      {/* Duty List Section */}
      <div className={styles.work}>
        <div className={styles.contentBox}>
          {dutyData.map((duty, index) => (
            <div key={index} className={styles.content}>
              <div className={styles.contentData}>
                <p className={styles.contentDataP}>Room no - {duty.room}</p>
                <p className={styles.contentDataP}>{duty.shift}</p>
              </div>
              <div className={styles.contentData}>
                <p className={styles.contentDataP}>Second Teacher</p>
                <p className={styles.contentDataP}>{duty.secondTeacher}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayDuty;
