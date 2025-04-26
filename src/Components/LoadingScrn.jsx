import { useLocation } from "react-router-dom";
import styles from "./LoadingScrn.module.css";

const LoadingScrn = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");

  const spinnerStyle = isAdmin
    ? {}
    : { border: "0.2rem solid #ffffff80", borderTop: "0.2rem solid #ffffff" };

  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner} style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingScrn;
