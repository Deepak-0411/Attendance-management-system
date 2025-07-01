import Logo from "../../assets/FAVICON.webp";
import styles from "./LogoSpinner.module.css";

const LogoSpinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <img className={styles.logo} src={Logo} alt="logo" />
    </div>
  );
};
export default LogoSpinner;
