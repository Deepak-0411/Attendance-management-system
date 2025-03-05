import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import styles from "./Faculty.module.css";
import SingleUplaod from "./SingleUplaod";

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false); 

  const { token } = useAuth();

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://gbu-server.vercel.app/api/admin/view-faculty",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch faculty data`);
        }

        const data = await response.json();
        setFacultyList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [token, refreshTrigger]); 

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty ?")) return;

    try {
      const response = await fetch(
        `https://gbu-server.vercel.app/api/admin/delete-faculty/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete faculty member.");
      }

      setFacultyList((prev) => prev.filter((faculty) => faculty.teacherId !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredFaculty = facultyList.filter((faculty) => {
    const name = (faculty.fName + " " + faculty.lName)?.toLowerCase() || "";
    const teacherId = String(faculty.teacherId || "");
    return name.includes(searchTerm) || teacherId.includes(searchTerm);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>Faculty Available</p>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={() => setShow(true)}>
            + Add Faculty
          </button>
        </div>
      </div>

      {show && (
        <div className={styles.uploadData}>
          <SingleUplaod
            dataToSend={{
              fName: { value: "", placeholder: "First name" },
              lName: { value: "", placeholder: "Last name" },
              teacherId: { value: "", placeholder: "Teacher ID" },
              username: { value: "", placeholder: "Username" },
              password: { value: "", placeholder: "Password" },
            }}
            close={() => {
              setShow(false);
              setRefreshTrigger((prev) => !prev);
            }}
            apiEndPointSingle={"addFaculty"}
            apiEndPointBulk="facultyimport"
          />
        </div>
      )}

      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.tableBox}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeading}>SR No.</th>
                <th className={styles.tableHeading}>Name</th>
                <th colSpan={2} className={styles.tableHeading}>Faculty ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((faculty, index) => (
                  <tr key={faculty.teacherId}>
                    <td>{index + 1}</td>
                    <td>{faculty.fName + " " + faculty.lName}</td>
                    <td>{faculty.teacherId}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(faculty.teacherId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Faculty;
