import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";
import Navbar from "./Navbar";
import Content from "./Content";



const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div className={styles.content}>
        <Outlet /> {/* This renders the dynamic content */}
      </div>
    </div>
  );
};

export default Dashboard;

