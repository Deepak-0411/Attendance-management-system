import { Outlet } from "react-router-dom";
import styles from "../styles/modules/layout/AdminLayout.module.css";
import Navbar from "../components/Navbar/Navbar";

const AdminLayout = () => {
  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div className={`${styles.content} `} id="content" >
        <Outlet /> {/* This renders the dynamic content */}
      </div>
    </div>
  );
};

export default AdminLayout;

