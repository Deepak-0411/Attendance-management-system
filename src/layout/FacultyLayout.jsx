import { Outlet, useNavigate } from "react-router-dom";
import styles from "../styles/modules/layout/FacultyLayout.module.css";

const FacultyLayout = () => {
  const navigate = useNavigate();
  const handleDevClick = () => {
    navigate("/devTeam");
  };
  return (
    <div className=" relative">
      <Outlet />
      <div className={styles.devTeamDiv}>
        <p className={styles.devTeam}>
          Designed & Developed By
          <button className={styles.devName} onClick={handleDevClick}>
            &nbsp;Ansh,&nbsp;
          </button>
          <button className={styles.devName} onClick={handleDevClick}>
            Deepak&nbsp;
          </button>
          &
          <button className={styles.devName} onClick={handleDevClick}>
            Harsh
          </button>
        </p>
      </div>
    </div>
  );
};
export default FacultyLayout;
