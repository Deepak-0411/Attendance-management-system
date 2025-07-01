import { useData } from "../../context/DataContext";
import styles from "./FilterBar.module.css";
import Input from "../Input/Input";
import { addDays } from "../../utility/GetDate";

const FilterBar = ({
  filters = [],
  dateFilter = true,
  optionsFilter = true,
  dateFilterContext,
  maxDate = 30,
  showSearchBtn = true,
  searchBtnAction = () => {},
}) => {
  const { fromDate, toDate, setFromDate, setToDate } =
    dateFilterContext || useData();

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
    <div className={styles.filterBarContainer} id="filterContainer">
      <div className={styles.filtersContainer}>
        {/* Date filters */}
        {dateFilter && (
          <div className={styles.filterBlock}>
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
          </div>
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
              <div key={name || idx} className={styles.filterBlock}>
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
      </div>

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
  );
};

export default FilterBar;
