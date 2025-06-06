import styles from "./Spinner.module.css";
import clsx from "clsx"; //clsx for cleaner conditional classes

const Spinner = ({ color = "blue", fullPage = false, size = "medium" }) => {
  
  const colorClass = color === "blue" ? styles.blue : styles.white;
  const sizeClass =
    size === "small"
      ? styles.small
      : size === "large"
      ? styles.large
      : styles.medium;

  return (
    <div
      className={clsx(styles.spinnerContainer, {
        [styles.fullPage]: fullPage,
      })}
    >
      <div className={clsx(styles.spinner, colorClass, sizeClass)}></div>
    </div>
  );
};

export default Spinner;
