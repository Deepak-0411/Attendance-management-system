import styles from "./Dashboard.module.css";
import Navbar from "./Navbar";
import Content from "./Content";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Navbar />
      <Content />
    </div>
  );
};

export default Dashboard;
