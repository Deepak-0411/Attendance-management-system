import Table from "../Table/Table";
import styles from "./SkippedData.module.css";

const SkippedData = ({ data }) => {
  const entries = Array.isArray(data?.entries) ? data.entries : [];
  const filteredData = entries.filter((entry) => entry.status === "skipped");

  const tableHeading = ["Status", "Row no.", "Reason"];
  const tableColumn = ["status", "row", "reason"];

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h2 className={styles.infoData}>Total rows: {data.totalRows}</h2>
        <h2 className={styles.infoData}>Total inserted: {data.inserted}</h2>
        <h2 className={styles.infoData}>Total skipped: {data.skipped}</h2>
      </div>
      <Table
        tableHeadings={tableHeading}
        tableColumn={tableColumn}
        filteredData={filteredData}
        idKey={"row"}
      />
    </div>
  );
};

export default SkippedData;
