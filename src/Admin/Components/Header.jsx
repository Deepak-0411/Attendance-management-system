import styles from "./CSS/DisplayData.module.css";

const Header = ({title,searchTerm,handleSearch,setShowUpload , addText}) => {
  return (
    <div className={`${styles.header} `} id="header">
      <p className={styles.title}>{title}</p>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={setShowUpload}>
          {addText}
        </button>
      </div>
    </div>
  );
};
export default Header;
