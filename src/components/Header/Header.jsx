import { useState } from "react";
import Input from "../Input/Input";
import styles from "./Header.module.css";

const Header = ({
  title = "",
  searchBoxPlaceholder = "",
  value = "",
  setValue = () => {},
  showUploadOverlay = () => {},
  addBtnText = "",
}) => {
  return (
    <div className={`${styles.header} `} id="header">
      <p className={styles.title}>{title}</p>
      <div className={styles.searchBox}>
        <Input
          type="1"
          role="text"
          placeholder={searchBoxPlaceholder}
          value={value}
          setValue={setValue}
        />
        <button className={styles.addButton} onClick={showUploadOverlay}>
          {addBtnText}
        </button>
      </div>
    </div>
  );
};
export default Header;
