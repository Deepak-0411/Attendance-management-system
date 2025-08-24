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
        <button className={styles.devTeam} onClick={handleDevClick}>
          Designed & Developed By
          <span className={styles.devName}> Team GBU</span>
        </button>
      </div>
    </div>
  );
};
export default FacultyLayout;
