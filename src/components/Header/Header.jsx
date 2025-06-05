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
  showExportBtn = false,
  exportBtnAction = () => {},
}) => {
  return (
    <div className={`${styles.header} `} id="header">
      <p className={styles.title}>{title}</p>

      {/* Search bar and add btn */}
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

        {/* Export button */}
        {showExportBtn && (
          <button className={styles.exportBtn} onClick={exportBtnAction}>
            EXPORT
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M3.7873 16.7812L2.7373 15.7125L4.9498 13.5H3.2623V12H7.4998V16.2375H5.9998V14.5687L3.7873 16.7812ZM8.9998 16.5V15H13.4998V6.75H9.7498V3H4.4998V10.5H2.9998V3C2.9998 2.5875 3.1468 2.2345 3.4408 1.941C3.7348 1.6475 4.0878 1.5005 4.4998 1.5H10.4998L14.9998 6V15C14.9998 15.4125 14.8531 15.7657 14.5596 16.0597C14.2661 16.3538 13.9128 16.5005 13.4998 16.5H8.9998Z"
                  fill="black"
                />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
export default Header;
