import styles from "./CSS/DisplayData.module.css";
import useTableHeight from "../../Utility/SetHeight";

const Table = ({
  tableHeading,
  filteredData,
  idKey,
  tableData,
  isDeleting,
  deleteData,
}) => {
  const { tableHeight } = useTableHeight();

  return (
    <div className={styles.tableBox} style={{ maxHeight: tableHeight }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.tableHeading} `}>
              SR No.
            </th>
            {tableHeading.map((heading, index) => (
              <th key={heading + index} className={`${styles.tableHeading} `}>
                {heading}
              </th>
            ))}
            <th
              className={`${styles.tableHeading} `}
            ></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item[idKey] + index}>
                <td>{index + 1}</td>
                {tableData.map((row) => (
                  <td key={row + index}>{item[row]}</td>
                ))}
                <td className={styles.tableDataLayout4}>
                  <button
                    disabled={isDeleting}
                    className={styles.deleteBtn}
                    onClick={deleteData}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        width="24"
                        height="24"
                        rx="3"
                        fill={isDeleting ? "#919191" : "#F04343"}
                      />
                      <path
                        d="M7.71429 17.5556C7.71429 18.35 8.35714 19 9.14286 19H14.8571C15.6429 19 16.2857 18.35 16.2857 17.5556V8.88889H7.71429V17.5556ZM17 6.72222H14.5L13.7857 6H10.2143L9.5 6.72222H7V8.16667H17V6.72222Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2 + tableHeading.length} className={styles.noData}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
