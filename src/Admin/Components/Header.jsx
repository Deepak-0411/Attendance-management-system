import styles from "./DisplayData.module.css";

const Header = ({title,searchTerm,handleSearch,setShow , addText}) => {
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
        <button className={styles.addButton} onClick={setShow}>
          {addText}
        </button>
      </div>
    </div>
  );
};
export default Header;
