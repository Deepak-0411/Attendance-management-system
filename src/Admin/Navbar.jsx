import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Navbar = () => {
  const location = useLocation(); // Get the current route
  const navItems = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Teachers", path: "/admin/teachers" },
    { name: "Students", path: "/admin/students" },
    { name: "Course details", path: "/admin/course-details" },
    { name: "Search", path: "/admin/search" }
  ];

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarHeading}>
        <h2>Hey Admin</h2>
      </div>
      <div className={styles.navbarBtns}>
        {navItems.map(({ name, path }) => (
          <Link 
            key={name} 
            to={path} 
            className={`${styles.navbarBtn} ${location.pathname === path ? styles.navbarBtnActive : ""}`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
