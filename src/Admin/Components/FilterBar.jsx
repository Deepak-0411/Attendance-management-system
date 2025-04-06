import React from "react";
import styles from "./DisplayData.module.css";

// {
//     type: "select",
//     label: "Room",
//     name: "room",
//     value: "A101",
//     onChange: (val, name) => {},
//     options: ["A101", "A102", "B103"],
//     placeholder: "Select Room"
//   }

const FilterBar = ({
  filters = [],
  showExportBtn = false,
  showSearchBtn = true,
  searchBtnAction,
  exportBtnAction,
}) => {
  const handleChange = (e, name, onChange) => {
    onChange(e.target.value, name);
  };

  const isSearchDisabled = filters.some(
    (filter) => filter.required && !filter.value
  );

  return (
    <div className={`${styles.filterContainer} `} id="filterContainer">
      <div className={styles.containerInside}>
        {filters.map((filter, index) => {
          if (filter.type === "date") {
            return (
              <React.Fragment key={index}>
                <label>{filter.label} </label>
                <input
                  type="date"
                  className={styles.filterInput}
                  value={filter.value}
                  onChange={(e) =>
                    handleChange(e, filter.name, filter.onChange)
                  }
                  required={filter.required}
                />
              </React.Fragment>
            );
          } else if (filter.type === "select") {
            return (
              <select
                key={index}
                className={styles.filterInput}
                value={filter.value || ""}
                onChange={(e) => handleChange(e, filter.name, filter.onChange)}
                required={filter.required}
              >
                <option value="">
                  {filter.placeholder || `Select ${filter.label}`}
                </option>
                {filter.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          }
          return null;
        })}
        {showSearchBtn && (
          <button
            className={styles.searchButton}
            onClick={searchBtnAction}
            disabled={isSearchDisabled}
          >
            Search
          </button>
        )}
      </div>
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
  );
};

export default FilterBar;
