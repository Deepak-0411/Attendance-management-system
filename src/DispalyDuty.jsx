import { useEffect, useState } from "react";
import styles from "./DisplayDuty.module.css";
import profileMale from "./assets/profileMale.jpg";
const DispalyDuty = () => {
  return (
    <div className={styles.parent}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>
            <img className={styles.img} src={profileMale} alt="User" />
            <p className={styles.userNameP}>Hey User!!</p>
        </div>
        <div className={styles.text}>
            <p className={styles.textP}>Your Exam Duty</p>
        </div>
      </div>

      <div className={styles.work}>
        {/* <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="search student"
            className={styles.searchInputBox}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
          <button className={styles.searchBtn} disabled={!search}>
            {" "}
            Search{" "}
          </button>
        </div> */}
        <div className={styles.contentBox}>
          <div className={styles.content}>
            <div className={styles.contentData}>
              <p className={styles.contentDataP}>Room no - IL202</p>
              <p className={styles.contentDataP}>Shift-1</p>
            </div>
            <div className={styles.contentData}>
              <p className={styles.contentDataP}>Second Teacher</p>
              <p className={styles.contentDataP}>38</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.contentData}>
              <p className={styles.contentDataP}>Room no - IL202</p>
              <p className={styles.contentDataP}>Shift-1</p>
            </div>
            <div className={styles.contentData}>
              <p className={styles.contentDataP}>Second Teacher</p>
              <p className={styles.contentDataP}>38</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.contentData}>
              <p className={styles.contentDataP}>Room no - IL202</p>
              <p className={styles.contentDataP}>Shift-1</p>
            </div>
            <div className={styles.contentData}>
              <p className={styles.contentDataP}>Second Teacher</p>
              <p className={styles.contentDataP}>38</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DispalyDuty;
