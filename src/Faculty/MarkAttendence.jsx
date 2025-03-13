import { useState } from "react";
import styles from "./CSS/MarkAttendence.module.css";
import ScanSheet from "./ScanSheet";

const MarkAttendence = () => {
  const [scanning, setScanning] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.detailsContainer}>
          <p className={styles.details}>Name - Deepak Kumar</p>
          <p className={styles.details}>Roll no - 235/UCS/050</p>
          <p className={styles.details}>Course Code - CS203</p>
          <p className={styles.details}>Course Name - Java Programming</p>
          <p className={styles.details}>Programme Name - BTech CSE-A</p>
          <p className={styles.details}>Sheet No. - </p>
        </div>
        <div className={styles.scanSheet}>
          <button
            className={styles.scanButton}
            onClick={() => setScanning(!scanning)}
          >
            scan sheet
          </button>
          {scanning ? (
            <div className={styles.ScanSheetOverlay}>
              <ScanSheet closeDiv={() => setScanning(false)} />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.statusButtons}>
          <button className={styles.presentBtn}>present</button>
          <button className={styles.absentBtn}>absent</button>
          <button className={styles.ufmBtn}>UFM</button>
        </div>

        <div className={styles.navButtons}>
          <button className={styles.back}>&lt;- Back</button>
          <button className={styles.next}>Next -&gt;</button>
        </div>
      </div>
    </div>
  );
};
export default MarkAttendence;
