import styles from "./ErrorBox.module.css";
const ErrorBox = ({ error, onclick }) => {
  return (
    <div className={styles.errorBox}>
      <p className={styles.errorp}>{error}</p>
      <button className={styles.retryBtn} onClick={onclick}>
        Retry
      </button>
    </div>
  );
};
export default ErrorBox;
