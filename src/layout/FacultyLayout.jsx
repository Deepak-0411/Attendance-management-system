import { Outlet } from "react-router-dom";
import styles from "../styles/modules/layout/FacultyLayout.module.css";

const FacultyLayout = () => {
  const handleDevClick =()=>{
    console.log("hii");
    
  };
  return (
    <>
      <Outlet />
      <div className={styles.devTeamDiv}>
        <p className={styles.devTeam}>
          Designed & Developed By
          <span className={styles.devName} onClick={handleDevClick}>
            {" Ansh"}
          </span>
          ,
          <span className={styles.devName} onClick={handleDevClick}>
            {" Deepak "}
          </span>
          &
          <span className={styles.devName} onClick={handleDevClick}>
            {" Harsh"}
          </span>
        </p>
      </div>
    </>
  );
};
export default FacultyLayout;
