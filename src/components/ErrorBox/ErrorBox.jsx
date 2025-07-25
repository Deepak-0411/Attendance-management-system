import styles from "./ErrorBox.module.css";
const ErrorBox = ({ error, onClick }) => {
  return (
    <div className={styles.errorBox}>
      <p className={styles.errorp}>{error}</p>
      <button className={styles.retryBtn} onClick={onClick}>
        Retry
      </button>
    </div>
  );
};
export default ErrorBox;
