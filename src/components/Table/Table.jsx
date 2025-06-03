import styles from "./Table.module.css";
import useTableHeight from "../../utility/setHeight";

const Table = ({
  tableHeadings,
  filteredData,
  idKey,
  tableColumn,
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
            {tableHeadings.map((heading, index) => (
              <th key={heading + index} className={`${styles.tableHeading} `}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item[idKey] + index}>
                <td>{index + 1}</td>
                {tableColumn.map((row) => (
                  <td key={row + index}>{item[row]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2 + tableHeadings.length} className={styles.noData}>
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
