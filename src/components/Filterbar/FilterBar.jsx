import { useData } from "../../context/DataContext";
import styles from "./FilterBar.module.css";
import Input from "../Input/Input";
import { addDays } from "../../utility/GetDate";

const FilterBar = ({
  filters = [],
  dateFilter = true,
  optionsFilter = true,
  maxDate = 30,
  showExportBtn = false,
  showSearchBtn = true,
  searchBtnAction,
  exportBtnAction,
}) => {
  const { fromDate, toDate, setFromDate, setToDate } = useData();

  const maxToDate = addDays(fromDate, maxDate);

  const handleFromDateChange = (value) => {
    setFromDate(value);

    if (maxDate === 0) {
      return;
    }

    const maxSelectableToDate = addDays(value, maxDate);
    if (toDate < value || toDate > maxSelectableToDate) {
      setToDate(value);
    }
  };

  const handleToDateChange = (value) => {
    if (value >= fromDate) {
      if (maxDate === 0 || value <= addDays(fromDate, maxDate)) {
        setToDate(value);
      }
    }
  };

  const isSearchDisabled =
    filters.some(({ required, value }) => required && !value) ||
    !fromDate ||
    !toDate;

  // Unified handler for inputs
  const handleChange = (value, name, onChange) => {
    if (onChange) onChange(value, name);
  };

  return (
    <div className={styles.filterContainer} id="filterContainer">
      <div className={styles.containerInside}>
        {/* Date filters */}
        {dateFilter && (
          <>
            <label htmlFor="fromDate"> From </label>
            <Input
              id="fromDate"
              role="date"
              value={fromDate}
              setValue={handleFromDateChange}
              required={true}
            />

            <label htmlFor="toDate"> To </label>
            <Input
              id="toDate"
              role="date"
              value={toDate}
              setValue={handleToDateChange}
              required={true}
              min={fromDate}
              {...(maxDate && { max: maxToDate })}
            />
          </>
        )}

        {/* Dynamic filters */}

        {optionsFilter &&
          filters.map(
            (
              {
                label,
                name,
                value,
                onChange,
                options,
                placeholder,
                required,
                type = 1,
              },
              idx
            ) => (
              <div key={name || idx}>
                <label htmlFor={label}>{label}</label>
                <Input
                  id={label}
                  role="select"
                  value={value || ""}
                  setValue={(val) => handleChange(val, name, onChange)}
                  options={options}
                  placeholder={placeholder}
                  type={type}
                  required={required}
                />
              </div>
            )
          )}

        {/* Search button */}
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
  );
};

export default FilterBar;
