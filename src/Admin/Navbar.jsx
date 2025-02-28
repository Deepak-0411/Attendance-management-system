import React, { useState } from "react";
import styles from "./Dashboard.module.css"; // Reuse same styles

const Navbar = () => {
  const [activeButton, setActiveButton] = useState("Home");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarHeading}>
        <h2>Hey Admin </h2>
      </div>
      <div className={styles.navbarBtns}>
      {["Home", "Teachers", "Students", "Course details", "Search"].map(
        (buttonName) => (
          <button
            key={buttonName}
            className={`${styles.navbarBtn} ${
              activeButton === buttonName ? styles.navbarBtnActive : ""
            }`}
            onClick={() => handleButtonClick(buttonName)}
          >
            {buttonName}
          </button>
        )
      )}
      </div>
    </div>
  );
};

export default Navbar;
