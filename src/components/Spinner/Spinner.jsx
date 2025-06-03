import styles from "./Spinner.module.css";

const LoadingScrn = ({ color = "blue" }) => {
  const styleClass = color === "blue" ? styles.blue : styles.white;

  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${styleClass}`}></div>
    </div>
  );
};

export default LoadingScrn;
